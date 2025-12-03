package com.wep.cart;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.wep.products.Products;

@RestController
@CrossOrigin(maxAge = 3600)
@RequestMapping("/usercart")
public class CartController {

	private final CartApplicationService service;

	public CartController(CartApplicationService service) {
		this.service = service;
	}


	@GetMapping("/allProductList")
	public Page<Cart> getAllProduct(@RequestParam(defaultValue = "0") int page,
	                                @RequestParam(defaultValue = "10") int size) {
	    Pageable pageable = PageRequest.of(page, size);
	    return service.getAllProducts(pageable);
	}


	@PostMapping("/in-cart")
	public ResponseEntity<List<Cart>> getProductsInCartByUserId(
	        @RequestParam String userId,
	        @RequestParam(value = "pageNumber", defaultValue = "0") int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "5") int pageSize) {
	    try {
	        List<Cart> products = service.filterAndProcessCartItems(userId, pageNumber, pageSize);
	        return ResponseEntity.ok(products);
	    } catch (IllegalArgumentException e) {
	        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
	    } catch (Exception e) {
	        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while retrieving products from the cart.", e);
	    }
	}



    @PostMapping("/add-product")
    public ResponseEntity<String> addProductToCartBy(
            @RequestParam String userId,
            @RequestParam String productId,
            @RequestParam String orderQuantity) {
        try {
        	service.addProductToCart(userId, productId, orderQuantity);
            return ResponseEntity.ok("Product added to the cart.");
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while adding the product to the cart.", e);
        }
    }

    
    @PostMapping("/remove-product")
    public ResponseEntity<String> removeProductFromCartBy(
            @RequestParam String userId,
            @RequestParam String productId) {
        try {
        	service.removeProductFromCartBy(userId, productId);
            return ResponseEntity.ok("Product removed from the cart.");
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while removing the product from the cart.", e);
        }
    }
	
    
    
    
    @PostMapping("/update-quantity")
    public ResponseEntity<String> updateProductsInCart(
    		@RequestParam String userId,
            @RequestParam String productId,
            @RequestParam String orderQuantity) {
        try {
        	boolean updated=service.updateProductsInCart(userId, productId, orderQuantity);
        	if(updated) {
            return ResponseEntity.ok("Product Quantity Updated.");
        	}
        	if(!updated) {
                return ResponseEntity.ok("Product Not Available.");
            	}
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while updating the product from the cart.", e);
        }
		return null;
    }
	
    

    @PostMapping("/finalize")
    public ResponseEntity<?> finalizeCartOrder(@RequestParam("userId") String userId,
    		@RequestParam("finalOrderAmount") Double finalOrderAmount, @RequestParam("addrId") String addrId,@RequestParam("paymentMethod") String paymentMethod) {
        try {
            List<Cart> failedCarts = service.cartOrderFinalizing(userId, finalOrderAmount, addrId,  paymentMethod);
            if (failedCarts.isEmpty()) {
                return ResponseEntity.ok("Cart order successfully finalized.");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(failedCarts);
            }
        } catch (Exception e) {
            // Handle other exceptions, e.g., database errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while finalizing the cart order.");
        }
    }
    
    
    @GetMapping("/cartcount")
	public ResponseEntity<String> getcountofProductsInCart(
	        @RequestParam String userId ) {
	    try {
	        String count = service.countofProductsInCart(userId);
	        return ResponseEntity.ok(count);
	    } catch (IllegalArgumentException e) {
	        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
	    } catch (Exception e) {
	        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while retrieving products from the cart.", e);
	    }
	}
    
    @GetMapping("/distinct-user-ids")
    public ResponseEntity<Page<Map<String, String>>> getDistinctUserIds(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Map<String, String>> distinctUserIds = service.findDistinctUserIdsWithNames(page, size);
        return ResponseEntity.ok(distinctUserIds);
    }

}
