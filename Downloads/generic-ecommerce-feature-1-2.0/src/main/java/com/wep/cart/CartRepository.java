package com.wep.cart;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.wep.products.Products;


@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {


	List<Cart> findByUserIdAndProductId(String userId, String productId);

	@Query("SELECT c FROM Cart c where userId = :userId")
	List<Cart> findByUserId(@Param("userId") String userId);

	
	@Query("SELECT c FROM Cart c where productId =:productId")
	List<Cart> findByProductId(@Param("productId")  String productId);
	

	@Query("SELECT c FROM Cart c where productId =:productId AND userId=:userId")
	Cart findByProductIdAndUserId(@Param("productId") String productId, @Param("userId") String userId);

	
	@Query("SELECT COALESCE(MAX(o.billNo), 0) FROM Orders o")
	Integer findLatestBillNumber();

	@Query("SELECT COUNT(DISTINCT c.productId) FROM Cart c WHERE c.userId = :userId")
	String countUniqueProductsInCartAsString(@Param("userId") String userId);
	
	@Query("SELECT DISTINCT c.userId FROM Cart c")
    Page<String> findDistinctUserIds(Pageable pageable);

}