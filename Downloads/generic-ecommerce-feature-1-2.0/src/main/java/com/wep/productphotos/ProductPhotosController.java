package com.wep.productphotos;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.wep.products.Products;
import com.wep.configs.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

@RestController
@CrossOrigin(maxAge = 3600)
@RequestMapping("/productphotos")
public class ProductPhotosController {

	private final ProductPhotosApplicationService service;
	
	@Autowired
	private S3Service s3Service;
	
	@Value("${aws.region}")
	private String region;
	@Value("${aws.s3.bucket}")
	private String bucketName;

	public ProductPhotosController(ProductPhotosApplicationService service) {
		this.service = service;
	}

	@GetMapping("/allPhotos")
	public ResponseEntity<List<ProductPhotos>> getAllProductPhotos(
	    @RequestParam(defaultValue = "0") int pageNumber,
	    @RequestParam(defaultValue = "10") int pageSize
	) {
	    Pageable pageable = PageRequest.of(pageNumber, pageSize);
	    Page<ProductPhotos> productPhotosPage = service.getAllProductPhotos(pageable);

	    List<ProductPhotos> productPhotos = productPhotosPage.getContent();
	    return new ResponseEntity<>(productPhotos, HttpStatus.OK);
	}

	@GetMapping("/{productId}")
	public ResponseEntity<ProductPhotos> getProductPhotoByProductId(@PathVariable String productId) {
		Optional<ProductPhotos> productPhotoOptional = service.getProductPhotosByProductId(productId);
		return productPhotoOptional.map(productPhoto -> new ResponseEntity<>(productPhoto, HttpStatus.OK))
				.orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	@GetMapping("/photo/{photoId}")
	public ResponseEntity<ProductPhotos> getProductPhotoByPhotoId(@PathVariable Long photoId) {
		ProductPhotos productPhoto = service.getProductPhotoByPhotoId(photoId);
		if (productPhoto != null) {
			return new ResponseEntity<>(productPhoto, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}

	@PostMapping("/upload/{productId}")
	public ResponseEntity<?> uploadMultiplePhotos(@PathVariable String productId, @RequestParam("photos") MultipartFile[] photos) {
		try {
			service.addMultipleProductPhotos(productId, photos);
			List<String> allUrls = service.getAllPhotoUrls(productId);
			return ResponseEntity.ok(allUrls);
		} catch (Exception e) {
			return ResponseEntity.internalServerError().body("Error uploading photos: " + e.getMessage());
		}
	}

	
@PutMapping("/update")
public ResponseEntity<?> updateProductPhoto(
        @RequestParam String productId,
        @RequestParam MultipartFile additionalPhoto,
        @RequestParam Integer sequenceNo) {

    try {
        service.updateProductPhoto(productId, additionalPhoto, sequenceNo);
        List<String> allUrls = service.getAllPhotoUrls(productId);
        return ResponseEntity.ok(allUrls);
    } catch (Exception e) {
        return ResponseEntity.internalServerError().body("Error updating product photo: " + e.getMessage());
    }
}


//	@GetMapping("/photoName")
//	public ResponseEntity<List<Products>> getProductByName(@RequestParam String photoName) {
//		List<Products> productPhoto = service.findProductsByName(photoName);
//		if (productPhoto != null) {
//			return new ResponseEntity<>(productPhoto, HttpStatus.OK);
//		}
//		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//	}

	
	@GetMapping("/photoName")
	public ResponseEntity<Page<Products>> getProductByName(@RequestParam String photoName,  
			@RequestParam(defaultValue = "0") int pageNumber,
		    @RequestParam(defaultValue = "10") int pageSize) {
		Page<Products> productPhoto = service.findProductsByName(photoName, pageNumber, pageSize);
		if (productPhoto != null) {
			 return ResponseEntity.ok(productPhoto);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
	
	@PostMapping("/make-public/{productId}")
	public ResponseEntity<?> makeProductPhotosPublic(@PathVariable String productId) {
		try {
			Optional<ProductPhotos> productPhotoOptional = service.getProductPhotosByProductId(productId);
			if (!productPhotoOptional.isPresent()) {
				return ResponseEntity.notFound().build();
			}
			
			ProductPhotos productPhoto = productPhotoOptional.get();
			int publicCount = 0;
			
			// Make all photo fields public
			String[] photoFields = {
				productPhoto.getPhotoName(),
				productPhoto.getPhotoName2(),
				productPhoto.getPhotoName3(),
				productPhoto.getPhotoName4(),
				productPhoto.getPhotoName5(),
				productPhoto.getPhotoName6(),
				productPhoto.getPhotoName7(),
				productPhoto.getPhotoName8(),
				productPhoto.getPhotoName9(),
				productPhoto.getPhotoName10()
			};
			
				for (String photoUrl : photoFields) {
					if (photoUrl != null && !photoUrl.isEmpty()) {
						// Extract the S3 key from the URL (handle both old and new formats)
						String s3Key = photoUrl.replace("https://" + bucketName + ".s3.amazonaws.com/", "")
											  .replace("https://" + bucketName + ".s3." + region + ".amazonaws.com/", "");
						s3Service.makeFilePublic(bucketName, s3Key);
						publicCount++;
					}
				}
			
			return ResponseEntity.ok("Made " + publicCount + " photos public for product " + productId);
		} catch (Exception e) {
			return ResponseEntity.internalServerError().body("Error making photos public: " + e.getMessage());
		}
	}
	
	@PostMapping("/make-all-public")
	public ResponseEntity<?> makeAllProductPhotosPublic() {
		try {
			List<ProductPhotos> allPhotos = service.getAllProductPhotos(PageRequest.of(0, 1000)).getContent();
			int totalPublic = 0;
			int totalErrors = 0;
			StringBuilder errorMessages = new StringBuilder();
			
			for (ProductPhotos productPhoto : allPhotos) {
				String[] photoFields = {
					productPhoto.getPhotoName(),
					productPhoto.getPhotoName2(),
					productPhoto.getPhotoName3(),
					productPhoto.getPhotoName4(),
					productPhoto.getPhotoName5(),
					productPhoto.getPhotoName6(),
					productPhoto.getPhotoName7(),
					productPhoto.getPhotoName8(),
					productPhoto.getPhotoName9(),
					productPhoto.getPhotoName10()
				};
				
				for (String photoUrl : photoFields) {
					if (photoUrl != null && !photoUrl.isEmpty()) {
						try {
							// Extract the S3 key from the URL (handle both old and new formats)
							String s3Key = photoUrl.replace("https://" + bucketName + ".s3.amazonaws.com/", "")
												  .replace("https://" + bucketName + ".s3." + region + ".amazonaws.com/", "");
							s3Service.makeFilePublic(bucketName, s3Key);
							totalPublic++;
						} catch (Exception e) {
							totalErrors++;
							errorMessages.append("Error with ").append(photoUrl).append(": ").append(e.getMessage()).append("; ");
						}
					}
				}
			}
			
			String result = "Made " + totalPublic + " photos public across all products";
			if (totalErrors > 0) {
				result += ". Errors: " + totalErrors + " - " + errorMessages.toString();
			}
			
			return ResponseEntity.ok(result);
		} catch (Exception e) {
			return ResponseEntity.internalServerError().body("Error making all photos public: " + e.getMessage());
		}
	}
	
	@GetMapping("/test-s3")
	public ResponseEntity<?> testS3Connection() {
		try {
			// Test if we can access S3
			Optional<ProductPhotos> testPhoto = service.getProductPhotosByProductId("80024e71-b5a0-448c-b153-07d0a993af17");
			if (testPhoto.isPresent()) {
				String testUrl = testPhoto.get().getPhotoName();
				if (testUrl != null) {
					// Extract the S3 key from the URL (handle both old and new formats)
					String s3Key = testUrl.replace("https://" + bucketName + ".s3.amazonaws.com/", "")
										  .replace("https://" + bucketName + ".s3." + region + ".amazonaws.com/", "");
					try {
						s3Service.makeFilePublic(bucketName, s3Key);
						return ResponseEntity.ok("S3 test successful. Made file public: " + s3Key);
					} catch (Exception e) {
						// If making public fails, try generating a presigned URL
						String presignedUrl = s3Service.generatePresignedUrl(bucketName, s3Key);
						return ResponseEntity.ok("S3 test - ACL failed, but presigned URL works: " + presignedUrl + " Error: " + e.getMessage());
					}
				}
			}
			return ResponseEntity.ok("S3 test completed - no test file found");
		} catch (Exception e) {
			return ResponseEntity.internalServerError().body("S3 test failed: " + e.getMessage());
		}
	}
	
	@GetMapping("/presigned-url/{productId}")
	public ResponseEntity<?> getPresignedUrls(@PathVariable String productId) {
		try {
			Optional<ProductPhotos> productPhotoOptional = service.getProductPhotosByProductId(productId);
			if (!productPhotoOptional.isPresent()) {
				return ResponseEntity.notFound().build();
			}
			
			ProductPhotos productPhoto = productPhotoOptional.get();
			java.util.Map<String, String> presignedUrls = new java.util.HashMap<>();
			
			String[] photoFields = {
				productPhoto.getPhotoName(),
				productPhoto.getPhotoName2(),
				productPhoto.getPhotoName3(),
				productPhoto.getPhotoName4(),
				productPhoto.getPhotoName5(),
				productPhoto.getPhotoName6(),
				productPhoto.getPhotoName7(),
				productPhoto.getPhotoName8(),
				productPhoto.getPhotoName9(),
				productPhoto.getPhotoName10()
			};
			
			for (int i = 0; i < photoFields.length; i++) {
				String photoUrl = photoFields[i];
				if (photoUrl != null && !photoUrl.isEmpty()) {
					// Extract the S3 key from the URL (handle both old and new formats)
					String s3Key = photoUrl.replace("https://" + bucketName + ".s3.amazonaws.com/", "")
										  .replace("https://" + bucketName + ".s3." + region + ".amazonaws.com/", "");
					String presignedUrl = s3Service.generatePresignedUrl(bucketName, s3Key);
					if (presignedUrl != null) {
						presignedUrls.put("photo" + (i + 1), presignedUrl);
					}
				}
			}
			
			return ResponseEntity.ok(presignedUrls);
		} catch (Exception e) {
			return ResponseEntity.internalServerError().body("Error generating presigned URLs: " + e.getMessage());
		}
	}
	
}
