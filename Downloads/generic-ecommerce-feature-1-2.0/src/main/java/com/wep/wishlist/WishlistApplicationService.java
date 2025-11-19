package com.wep.wishlist;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wep.products.Products;
import com.wep.products.ProductsRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class WishlistApplicationService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private ProductsRepository productRepository; 

    public List<WishlistItem> getWishlistByUserId(String userId) {
        List<Wishlist> wishlist = wishlistRepository.findByUserId(userId);
        List<WishlistItem> wishlistWithProductInfo = new ArrayList<>();

        for (Wishlist item : wishlist) {
            Products product = productRepository.findById(item.getProductId()).orElse(null);
            if (product != null) {
                WishlistItem wishlistItem = new WishlistItem();
                wishlistItem.setProductId(item.getProductId());
                wishlistItem.setProduct(product);
                wishlistWithProductInfo.add(wishlistItem);
            }
        }

        return wishlistWithProductInfo;
    }

    // Add product to wishlist by userId
    public Wishlist addToWishlist(String userId, String productId) {
        Wishlist existingItem = wishlistRepository.findByUserIdAndProductId(userId, productId);
        if (existingItem != null) {
            return existingItem;
        }
        
        Wishlist wishlistItem = new Wishlist();
        wishlistItem.setUserId(userId);
        wishlistItem.setProductId(productId);
        return wishlistRepository.save(wishlistItem);
    }

    // Delete particular product from wishlist
    public boolean deleteFromWishlist(String userId, String productId) {
        Wishlist wishlistItem = wishlistRepository.findByUserIdAndProductId(userId, productId);
        if (wishlistItem != null) {
            wishlistRepository.delete(wishlistItem);
            return true;
        }
        return false;
    }

    // Clear all products from wishlist
    public void clearWishlist(String userId) {
        List<Wishlist> wishlist = wishlistRepository.findByUserId(userId);
        wishlistRepository.deleteAll(wishlist);
    }
}
