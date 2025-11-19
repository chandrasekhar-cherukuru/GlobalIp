package com.wep.wishlist;

import com.wep.products.Products;

public class WishlistItem {
    private String productId;
    private Products product;

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public Products getProduct() {
        return product;
    }

    public void setProduct(Products product) {
        this.product = product;
    }
}
