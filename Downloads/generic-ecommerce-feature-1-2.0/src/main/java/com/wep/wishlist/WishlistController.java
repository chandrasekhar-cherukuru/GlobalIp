package com.wep.wishlist;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/wishlist")
public class WishlistController {

    @Autowired
    private WishlistApplicationService wishlistService;

    // Get wishlist by userId
    @GetMapping("/get/{userId}")
    public ResponseEntity<List<WishlistItem>> getWishlistByUserId(@PathVariable String userId) {
    	List<WishlistItem> wishlist = wishlistService.getWishlistByUserId(userId);
        if (wishlist.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Wishlist not found for user with ID: " + userId);
        }
        return ResponseEntity.ok(wishlist);
    }

    // Add product to wishlist by userId
    @PostMapping("/add/{userId}")
    public ResponseEntity<Wishlist> addToWishlist(@PathVariable String userId, @RequestBody String productId) {
        Wishlist wishlistItem = wishlistService.addToWishlist(userId, productId);
        if (wishlistItem == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to add product to wishlist.");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(wishlistItem);
    }

    // Delete particular product from wishlist
    @DeleteMapping("/delete/{userId}/{productId}")
    public ResponseEntity<Void> deleteFromWishlist(@PathVariable String userId, @PathVariable String productId) {
        boolean deleted = wishlistService.deleteFromWishlist(userId, productId);
        if (!deleted) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product with ID: " + productId + " not found in wishlist for user with ID: " + userId);
        }
        return ResponseEntity.noContent().build();
    }

    // Clear all products from wishlist
    @DeleteMapping("/delete-all/{userId}/clear")
    public ResponseEntity<Void> clearWishlist(@PathVariable String userId) {
        wishlistService.clearWishlist(userId);
        return ResponseEntity.noContent().build();
    }
}
