package com.wep.customProd;

import com.wep.configs.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class customProdService {

    @Autowired
    private customProdRepository productRepository;

    @Autowired
    private S3Service s3Service;

    public List<customProd> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<customProd> getProductById(String productId) {
        return productRepository.findByProductId(productId);
    }

    public boolean addOrUpdateProducts(customProd product) {
        product.setProductUpdatedDateAndTime(LocalDateTime.now());
        productRepository.save(product);
        return true;
    }

    public boolean updateProduct(String productId, customProd updated) {
        customProd existing = productRepository.findByProductId(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));

        if (updated.getProductName() != null) existing.setProductName(updated.getProductName());
        if (updated.getProductRate() != null) existing.setProductRate(updated.getProductRate());
        if (updated.getProductMRP() != null) existing.setProductMRP(updated.getProductMRP());
        if (updated.getProductQuantity() != 0) existing.setProductQuantity(updated.getProductQuantity());
        if (updated.getProductHSN() != null) existing.setProductHSN(updated.getProductHSN());
        if (updated.getProductGST() != null) existing.setProductGST(updated.getProductGST());
        if (updated.getProductDesignNo() != null) existing.setProductDesignNo(updated.getProductDesignNo());
        if (updated.getProductCategory() != null) existing.setProductCategory(updated.getProductCategory());
        if (updated.getProductSubcategory() != null) existing.setProductSubcategory(updated.getProductSubcategory());
        if (updated.getProductColor() != null) existing.setProductColor(updated.getProductColor());
        if (updated.getProductBrand() != null) existing.setProductBrand(updated.getProductBrand());
        if (updated.getProductSize() != null) existing.setProductSize(updated.getProductSize());
        if (updated.getProductStyle() != null) existing.setProductStyle(updated.getProductStyle());
        if (updated.getProductSleeves() != null) existing.setProductSleeves(updated.getProductSleeves());
        if (updated.getProductDescription() != null) existing.setProductDescription(updated.getProductDescription());
        if (updated.getProductDescription2() != null) existing.setProductDescription2(updated.getProductDescription2());
        if (updated.getProductStock() != null) existing.setProductStock(updated.getProductStock());
        if (updated.getProductRatings() != null) existing.setProductRatings(updated.getProductRatings());
        if (updated.getPurchaseNo() != null) existing.setPurchaseNo(updated.getPurchaseNo());
        if (updated.getPurchaseDate() != null) existing.setPurchaseDate(updated.getPurchaseDate());
        if (updated.getOfferProduct() != null) existing.setOfferProduct(updated.getOfferProduct());
        if (updated.getLightningDealProduct() != null) existing.setLightningDealProduct(updated.getLightningDealProduct());
        if (updated.getDealofdayProduct() != null) existing.setDealofdayProduct(updated.getDealofdayProduct());
        if (updated.getIsActive() != null) existing.setIsActive(updated.getIsActive());
        if (updated.getNewArrival() != null) existing.setNewArrival(updated.getNewArrival());
        if (updated.getSacredOfferings() != null) existing.setSacredOfferings(updated.getSacredOfferings());

        // Enforce mutual exclusivity between newArrival and sacredOfferings
        if (Boolean.TRUE.equals(existing.getNewArrival())) {
            existing.setSacredOfferings(false);
        }
        if (Boolean.TRUE.equals(existing.getSacredOfferings())) {
            existing.setNewArrival(false);
        }

        existing.setProductUpdatedDateAndTime(LocalDateTime.now());
        productRepository.save(existing);
        return true;
    }

    public void deleteProduct(String productId) {
        customProd existing = productRepository.findByProductId(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));
        productRepository.delete(existing);
    }

    // removed hidden-related APIs per requirements

    public List<customProd> findNewArrivals() { return productRepository.findByNewArrivalTrue(); }
    public List<customProd> findSacredOfferings() { return productRepository.findBySacredOfferingsTrue(); }

    public customProd updateSpecialFlags(String productId, Boolean newArrival, Boolean sacredOfferings) {
        customProd product = productRepository.findByProductId(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));
        if (newArrival != null) product.setNewArrival(newArrival);
        if (sacredOfferings != null) product.setSacredOfferings(sacredOfferings);
        // Enforce mutual exclusivity
        if (Boolean.TRUE.equals(product.getNewArrival())) {
            product.setSacredOfferings(false);
        }
        if (Boolean.TRUE.equals(product.getSacredOfferings())) {
            product.setNewArrival(false);
        }
        product.setProductUpdatedDateAndTime(LocalDateTime.now());
        return productRepository.save(product);
    }

    @Transactional
    public boolean updateProductImages(String productId,
                                       MultipartFile prodImg1,
                                       MultipartFile prodImg2,
                                       MultipartFile prodImg3,
                                       MultipartFile prodImg4,
                                       MultipartFile prodImg5,
                                       MultipartFile prodImg6,
                                       String prodImg1Url,
                                       String prodImg2Url,
                                       String prodImg3Url,
                                       String prodImg4Url,
                                       String prodImg5Url,
                                       String prodImg6Url) {
        customProd product = productRepository.findByProductId(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));

        String f1 = (prodImg1 != null && !prodImg1.isEmpty()) ? uploadFileToS3(productId, prodImg1, 1) : prodImg1Url;
        String f2 = (prodImg2 != null && !prodImg2.isEmpty()) ? uploadFileToS3(productId, prodImg2, 2) : prodImg2Url;
        String f3 = (prodImg3 != null && !prodImg3.isEmpty()) ? uploadFileToS3(productId, prodImg3, 3) : prodImg3Url;
        String f4 = (prodImg4 != null && !prodImg4.isEmpty()) ? uploadFileToS3(productId, prodImg4, 4) : prodImg4Url;
        String f5 = (prodImg5 != null && !prodImg5.isEmpty()) ? uploadFileToS3(productId, prodImg5, 5) : prodImg5Url;
        String f6 = (prodImg6 != null && !prodImg6.isEmpty()) ? uploadFileToS3(productId, prodImg6, 6) : prodImg6Url;

        product.setProdImg1(f1);
        product.setProdImg2(f2);
        product.setProdImg3(f3);
        product.setProdImg4(f4);
        product.setProdImg5(f5);
        product.setProdImg6(f6);
        product.setProductUpdatedDateAndTime(LocalDateTime.now());
        productRepository.save(product);
        return true;
    }

    private String uploadFileToS3(String productId, MultipartFile file, int sequenceNo) {
        String key = productId + "/" + productId + "_" + sequenceNo + "_" + file.getOriginalFilename();
        s3Service.uploadFile(key, file);
        return "https://" + System.getProperty("aws.s3.bucket", "") + ".s3.amazonaws.com/" + key;
    }
}



