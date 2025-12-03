package com.wep.products;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@CrossOrigin(maxAge = 3600)
@RequestMapping("/products")
public class ProductsController {

	private final ProductsApplicationService service;
	private final ProductsRepository productsRepository;

	public ProductsController(ProductsApplicationService service, ProductsRepository productsRepository) {
		this.service = service;
		this.productsRepository = productsRepository;

	}

	@GetMapping("/productId")
	public Products getProductById(@RequestParam(value = "userId") String userId,
			@RequestParam(value = "id") String id) {
		return service.getProductByID(id, userId);
	}

	@GetMapping("/allProductList")
	public List<Products> getAllProducts() {
		return service.getAllProducts();
	}
	@GetMapping("/allHiddenProductList")
	public List<Products> getAllHiddenProducts() {
		return service.getAllHiddenProducts();
	}
	
	@DeleteMapping("/delete/{productId}")
	public ResponseEntity<String> deleteProduct(@PathVariable String productId) {
		try {
			boolean isDeleted = service.deleteProduct(productId);
			if (isDeleted) {
				return ResponseEntity.ok("Product successfully deleted.");
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found.");
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete product: " + e.getMessage());
		}
	}
	@PostMapping("/hide")
    public ResponseEntity<String> hideProduct(@RequestParam String productId) {
        boolean result = service.updateProductVisibility(productId, true);
        if (result) {
            return ResponseEntity.ok("Product hidden successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found.");
        }
    }

    @PostMapping("/unhide")
    public ResponseEntity<String> unhideProduct(@RequestParam String productId) {
        boolean result = service.updateProductVisibility(productId, false);
        if (result) {
            return ResponseEntity.ok("Product unhidden successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found.");
        }
    }
	@PostMapping("/create")
	public ResponseEntity<Products> createProduct(@RequestBody Products product) {
	    if (product == null) {
	        return ResponseEntity.badRequest().build();
	    }
	    try {
	    	if(product.getProductId() == null || product.getProductId().isEmpty()) {
	    		String productId = service.generateProductId();
	    		product.setProductId(productId);
	    	}
	        boolean savedProduct = service.saveProduct(product);
	        if (savedProduct) {
	            return ResponseEntity.status(HttpStatus.CREATED).body(product);
	        } else {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	        }
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	    }
	}
	 @PutMapping("/update/{productId}")
	    public ResponseEntity<String> updateProduct(@PathVariable String productId, @RequestBody Products updatedProduct) {
	        service.updateProduct(productId, updatedProduct);
	        return ResponseEntity.ok("Product updated successfully");
	    }



	@GetMapping("/filter")
	public Page<Products> filterProducts(@RequestParam(value = "userId") String userId,
			@RequestParam(value = "minPrice", required = false) Double minPrice,
			@RequestParam(value = "maxPrice", required = false) Double maxPrice,
			@RequestParam(value = "orderBy", required = false, defaultValue = "true") Boolean orderByAsc,
			@RequestParam(value = "category", required = false) String category,
			@RequestParam(value = "subcategory", required = false) String subcategoryId,
			@RequestParam(value = "orderBy", required = false, defaultValue = "false") Boolean newArrival,
			@RequestParam(value = "searchName", required = false) String searchName,
			@RequestParam(value = "pageNumber", defaultValue = "0") int pageNumber,
			@RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
		return service.filterProducts(minPrice, maxPrice, orderByAsc, category, subcategoryId, newArrival, searchName,
				pageNumber, pageSize, userId);
	}

	@GetMapping("/hiddenFalse")
	public List<Products> findByIsHiddenFalse() {
		return service.findByIsHiddenFalse();
	}

	@GetMapping("/sortByDate")
	public List<Products> findAllByDate(@RequestParam(name = "userId") String userId,
			@RequestParam(name = "pageNumber", defaultValue = "0") int pageNumber,
			@RequestParam(name = "pageSize", defaultValue = "10") int pageSize) {
		PageRequest.of(pageNumber, pageSize);
		Page<Products> productPage = service.findAllByDate(pageNumber, pageSize, userId);
		return productPage.getContent();
	}

	@GetMapping("/autocompleteSearch")
	public List<String> autoCompleteSearchBar(@RequestParam String name) {
		return service.autoCompleteSearchBar(name);
	}

	@GetMapping("/list")
	@ResponseBody
	public List<Products> getProductsByPageAndPageSize(
			@RequestParam(name = "pageNumber", defaultValue = "0") int pageNumber,
			@RequestParam(name = "pageSize", defaultValue = "10") int pageSize,
			@RequestParam(name = "userId") String userId) {
		Pageable pageable = PageRequest.of(pageNumber, pageSize);
		Page<Products> productPage = productsRepository.findAll(pageable);
		List<Products> results = productPage.getContent();

		// Call the service method to process products
		List<Products> processedProducts = service.processProducts(results, userId);

		return processedProducts;
	}

}
