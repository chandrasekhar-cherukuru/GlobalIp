package com.wep.productRatings;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product-ratings")
public class ProductRatingsController {

    @Autowired
    private ProductRatingsService productRatingsService;

    @GetMapping("/{id}")
    public ProductRatings getProductRatingById(@PathVariable Long id) {
        return productRatingsService.getProductRatingById(id);
    }

    @GetMapping("/product/{productId}")
    public List<ProductRatings> getProductRatingsByProductId(@PathVariable String productId) {
        return productRatingsService.getProductRatingsByProductId(productId);
    }

    @PostMapping
    public ProductRatings addProductRating(@RequestBody ProductRatings productRatings) {
        return productRatingsService.addProductRating(productRatings);
    }

    @PutMapping("/{id}")
    public ProductRatings updateProductRating(@PathVariable Long id, @RequestBody ProductRatings productRatings) {
        return productRatingsService.updateProductRating(id, productRatings);
    }

    @DeleteMapping("/{id}")
    public void deleteProductRating(@PathVariable Long id) {
        productRatingsService.deleteProductRating(id);
    }
}
