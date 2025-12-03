package com.wep.productRatings;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductRatingsService {

    @Autowired
    private ProductRatingsRepository productRatingsRepository;

    public ProductRatings getProductRatingById(Long id) {
        return productRatingsRepository.findById(id).orElse(null);
    }

    public List<ProductRatings> getProductRatingsByProductId(String productId) {
        return productRatingsRepository.findByProductId(productId);
    }

    public ProductRatings addProductRating(ProductRatings productRatings) {
        return productRatingsRepository.save(productRatings);
    }

    public ProductRatings updateProductRating(Long id, ProductRatings productRatings) {
        if (productRatingsRepository.existsById(id)) {
            productRatings.setId(id);
            return productRatingsRepository.save(productRatings);
        }
        return null;
    }

    public void deleteProductRating(Long id) {
        productRatingsRepository.deleteById(id);
    }
}
