package com.wep.productRatings;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRatingsRepository extends JpaRepository<ProductRatings, Long> {
    List<ProductRatings> findByProductId(String productId);
}
