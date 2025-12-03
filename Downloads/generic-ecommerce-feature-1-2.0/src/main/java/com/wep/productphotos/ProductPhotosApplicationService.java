package com.wep.productphotos;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;


import com.wep.configs.S3Service;
import com.wep.products.Products;
import com.wep.products.ProductsRepository;

import java.io.FileNotFoundException;
import java.io.IOException;

@Service
public class ProductPhotosApplicationService {

	@Autowired
	private final ProductPhotosRepository rep;
	@Autowired
	private final ModelMapper modelMapper;
	@Autowired
	private S3Service s3Service;
	@Autowired
	private final ProductsRepository productRep;

	public ProductPhotosApplicationService(ProductPhotosRepository rep, ModelMapper modelMapper,
			ProductsRepository productRep) {
		this.rep = rep;
		this.modelMapper = modelMapper;
		this.productRep = productRep;
	}

	public Page<ProductPhotos> getAllProductPhotos(Pageable pageable) {
		Page<ProductPhotos> productPhotosPage = rep.findAll(pageable);

		// Fetch product names for each product photo
		for (ProductPhotos photo : productPhotosPage.getContent()) {
			String productName = photo.getProducts().getProductName();
			photo.setProductPhotoName(productName); // Assuming setProductPhotoName exists in ProductPhotos entity
		}

		return productPhotosPage;
	}

	public Optional<ProductPhotos> getProductPhotosByProductId(String productId) {
		Optional<ProductPhotos> optionalProductPhotos = rep.findAllPhotosWithProductID(productId);

		if (optionalProductPhotos.isPresent()) {
			ProductPhotos productPhotos = optionalProductPhotos.get();
			// String productName = productPhotos.getProducts().getProductName();
			// productPhotos.setProductPhotoName(productName); // Assuming
			// setProductPhotoName exists in ProductPhotos entity
			return Optional.of(productPhotos);
		} else {
			return Optional.empty();
		}
	}

	public ProductPhotos getProductPhotoByPhotoId(Long photoId) {
		return rep.findAllPhotosWithPhotoID(photoId);
	}

	public List<String> getAllPhotoUrls(String productId) {
    Optional<ProductPhotos> optional = getProductPhotosByProductId(productId);
    if (!optional.isPresent()) return new ArrayList<>();
    ProductPhotos photo = optional.get();
    List<String> urls = new ArrayList<>();
    if (photo.getPhotoName() != null) urls.add(photo.getPhotoName());
    if (photo.getPhotoName2() != null) urls.add(photo.getPhotoName2());
    if (photo.getPhotoName3() != null) urls.add(photo.getPhotoName3());
    if (photo.getPhotoName4() != null) urls.add(photo.getPhotoName4());
    if (photo.getPhotoName5() != null) urls.add(photo.getPhotoName5());
    if (photo.getPhotoName6() != null) urls.add(photo.getPhotoName6());
    if (photo.getPhotoName7() != null) urls.add(photo.getPhotoName7());
    if (photo.getPhotoName8() != null) urls.add(photo.getPhotoName8());
    if (photo.getPhotoName9() != null) urls.add(photo.getPhotoName9());
    if (photo.getPhotoName10() != null) urls.add(photo.getPhotoName10());
    return urls;
}


	@Transactional
	public List<ProductPhotos> addMultipleProductPhotos(String productId, MultipartFile[] photos) throws IOException {
		List<ProductPhotos> savedPhotos = new ArrayList<>();
		for (MultipartFile photo : photos) {
			if (photo.isEmpty()) {
				continue; // Skip empty files
			}
			ProductPhotos productPhoto = storePhoto(productId, photo);
			savedPhotos.add(productPhoto);
		}
		return savedPhotos;
	}

	@Value("${aws.s3.bucket}")
	private String bucketName;
	@Value("${aws.region}")
	private String region;

	private ProductPhotos storePhoto(String productId, MultipartFile photo) throws IOException {
		String originalFilename = StringUtils.cleanPath(photo.getOriginalFilename());
		String newFilename = productId + "_" + System.currentTimeMillis() + "_" + originalFilename;
		String s3Key = productId + "/" + newFilename;
		boolean uploadSuccess = s3Service.uploadFile(s3Key, photo);
		if (!uploadSuccess) {
			throw new IOException("Failed to upload file to S3: " + s3Key);
		}
		String s3Url = "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + s3Key;
		System.out.println("Saving ProductPhotos with S3 URL: " + s3Url);
		ProductPhotos productPhoto = new ProductPhotos();
		productPhoto.setProductId(productId);
		productPhoto.setPhotoName(s3Url);
		return rep.save(productPhoto);
	}

	@Transactional
	public ProductPhotos updateProductPhoto(String productId, MultipartFile additionalPhoto, int sequenceNo)
			throws FileNotFoundException {
		if (additionalPhoto == null || additionalPhoto.isEmpty()) {
			throw new FileNotFoundException("Provided file is empty or null.");
		}

		if (sequenceNo < 1 || sequenceNo > 10) {
			throw new IllegalArgumentException("Sequence number must be between 1 and 10.");
		}

		// Find the existing product photo for the given productId
		Optional<ProductPhotos> productPhotoOptional = getProductPhotosByProductId(productId);
		ProductPhotos productPhoto;
		
		if (!productPhotoOptional.isPresent()) {
			// Create a new ProductPhotos record if none exists
			productPhoto = new ProductPhotos();
			productPhoto.setProductId(productId);
			productPhoto.setCompCode(1L); // Set a default company code
			System.out.println("Created new ProductPhotos record for productId: " + productId);
		} else {
			productPhoto = productPhotoOptional.get();
			System.out.println("Found existing ProductPhotos record for productId: " + productId);
		}

		// Process the photo update
		try {
			String photoField = getPhotoFieldForSequence(productPhoto, sequenceNo);
			
			// Only try to delete existing file if there is one and the ProductPhotos record already existed
			if (productPhotoOptional.isPresent() && photoField != null && !photoField.isEmpty()) {
				if (!deleteFileFromDirectory(bucketName, productId, photoField)) {
					throw new IOException("Failed to delete existing file from directory.");
				}
			}

			String originalFilename = StringUtils.cleanPath(additionalPhoto.getOriginalFilename());
			String newFilename = productId + "_" + sequenceNo + "_" + originalFilename;
			String s3Key = productId + "/" + newFilename;
			boolean uploadSuccess = s3Service.uploadFile(s3Key, additionalPhoto);
			if (!uploadSuccess) {
				throw new IOException("Failed to upload file to S3: " + s3Key);
			}

			String s3Url = "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + s3Key;
			setPhotoUrl(productPhoto, sequenceNo, s3Url);

			return rep.save(productPhoto);
		} catch (Exception e) {
			throw new RuntimeException("Error updating product photo: " + e.getMessage(), e);
		}
	}

	private void setPhotoUrl(ProductPhotos productPhoto, int sequenceNo, String url) {
		switch (sequenceNo) {
			case 1:
				productPhoto.setPhotoName(url);
				break;
			case 2:
				productPhoto.setPhotoName2(url);
				break;
			case 3:
				productPhoto.setPhotoName3(url);
				break;
			case 4:
				productPhoto.setPhotoName4(url);
				break;
			case 5:
				productPhoto.setPhotoName5(url);
				break;
			case 6:
				productPhoto.setPhotoName6(url);
				break;
			case 7:
				productPhoto.setPhotoName7(url);
				break;
			case 8:
				productPhoto.setPhotoName8(url);
				break;
			case 9:
				productPhoto.setPhotoName9(url);
				break;
			case 10:
				productPhoto.setPhotoName10(url);
				break;
			default:
				throw new IllegalArgumentException("Invalid sequence number: " + sequenceNo);
		}
	}

	private boolean deleteFileFromDirectory(String bucketName, String productId, String existingFilename)
			throws Exception {
		try {
			String[] urlParts = existingFilename.split("/");
			if (urlParts.length <= 1) {
				return true;
			}
			String s3ObjectKey = productId + "/" + urlParts[3];
			s3Service.deleteFile(bucketName, s3ObjectKey);

		} catch (Exception e) {
			throw new Exception("Failed to delete S3 object: " + e.getMessage(), e);
		}
		return true;
	}

	private String getPhotoFieldForSequence(ProductPhotos productPhoto, int sequenceNo) {
		String photoName = null;
		switch (sequenceNo) {
			case 1:
				photoName = productPhoto.getPhotoName();
				break;
			case 2:
				photoName = productPhoto.getPhotoName2();
				break;
			case 3:
				photoName = productPhoto.getPhotoName3();
				break;
			case 4:
				photoName = productPhoto.getPhotoName4();
				break;
			case 5:
				photoName = productPhoto.getPhotoName5();
				break;
			case 6:
				photoName = productPhoto.getPhotoName6();
				break;
			case 7:
				photoName = productPhoto.getPhotoName7();
				break;
			case 8:
				photoName = productPhoto.getPhotoName8();
				break;
			case 9:
				photoName = productPhoto.getPhotoName9();
				break;
			case 10:
				photoName = productPhoto.getPhotoName10();
				break;
			default:
				// Handle invalid sequence numbers or other cases
				break;
		}
		return photoName;
	}

	public List<Products> findProductsByName(String name) {
		return productRep.findProductDetailsByProductName(name);
	}

	public Page<Products> findProductsByName(String name, int pageNumber, int pageSize) {
		Pageable pageable = PageRequest.of(pageNumber, pageSize);
		return productRep.findProductDetailsByProductNamePaged(name, pageable);
	}

}
