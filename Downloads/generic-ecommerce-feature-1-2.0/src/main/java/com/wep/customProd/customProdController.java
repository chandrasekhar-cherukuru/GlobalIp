package com.wep.customProd;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(maxAge = 3600)
@RequestMapping("/api/customProducts")
public class customProdController {

    private final customProdService productService;

    public customProdController(customProdService productService) {
        this.productService = productService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<customProd>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<customProd> getProductById(@PathVariable String id) {
        Optional<customProd> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    public ResponseEntity<String> addProduct(@RequestBody customProd body) {
        return productService.addOrUpdateProducts(body) ? ResponseEntity.ok("Product added successfully")
                : ResponseEntity.status(500).body("Failed to add product");
    }

    @PutMapping("/{id}")
    public ResponseEntity<customProd> updateProducts(@PathVariable String id, @RequestBody customProd updatedProduct) {
        productService.updateProduct(id, updatedProduct);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // Special toggles
    @PostMapping("/{id}/update-special")
    public ResponseEntity<customProd> updateSpecial(@PathVariable String id,
                                                    @RequestParam(required = false) Boolean newArrival,
                                                    @RequestParam(required = false) Boolean sacredOfferings) {
        return ResponseEntity.ok(productService.updateSpecialFlags(id, newArrival, sacredOfferings));
    }

    @GetMapping("/new-arrivals")
    public ResponseEntity<List<customProd>> listNewArrivals() {
        return ResponseEntity.ok(productService.findNewArrivals());
    }

    @GetMapping("/sacred-offerings")
    public ResponseEntity<List<customProd>> listSacredOfferings() {
        return ResponseEntity.ok(productService.findSacredOfferings());
    }

    @PostMapping("/update-images/{productId}")
    public ResponseEntity<String> updateProductImages(
            @PathVariable String productId,
            @RequestParam(value = "prodImg1", required = false) MultipartFile prodImg1,
            @RequestParam(value = "prodImg2", required = false) MultipartFile prodImg2,
            @RequestParam(value = "prodImg3", required = false) MultipartFile prodImg3,
            @RequestParam(value = "prodImg4", required = false) MultipartFile prodImg4,
            @RequestParam(value = "prodImg5", required = false) MultipartFile prodImg5,
            @RequestParam(value = "prodImg6", required = false) MultipartFile prodImg6,
            @RequestParam(value = "prodImg1Url", required = false) String prodImg1Url,
            @RequestParam(value = "prodImg2Url", required = false) String prodImg2Url,
            @RequestParam(value = "prodImg3Url", required = false) String prodImg3Url,
            @RequestParam(value = "prodImg4Url", required = false) String prodImg4Url,
            @RequestParam(value = "prodImg5Url", required = false) String prodImg5Url,
            @RequestParam(value = "prodImg6Url", required = false) String prodImg6Url) {

        boolean success = productService.updateProductImages(
                productId,
                prodImg1, prodImg2, prodImg3, prodImg4, prodImg5, prodImg6,
                prodImg1Url, prodImg2Url, prodImg3Url, prodImg4Url, prodImg5Url, prodImg6Url
        );

        return success ? ResponseEntity.ok("Images updated successfully")
                : ResponseEntity.status(500).body("Failed to update images");
    }
}



