package com.wep.wishlist;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;


public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
	 List<Wishlist> findByUserId(String userId);

	    Wishlist findByUserIdAndProductId(String userId, String productId);

	    @Modifying
	    @Transactional
	    @Query("DELETE FROM Wishlist w WHERE w.userId = ?1")
	    void deleteByUserId(String userId);
}
