package com.wep.customProd;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface customProdRepository extends JpaRepository<customProd, Integer> {

    @Query("SELECT c FROM customProd c WHERE c.productId = :productId")
    Optional<customProd> findByProductId(String productId);

    @Query("SELECT c FROM customProd c WHERE LOWER(c.productName) LIKE LOWER(CONCAT('%', :productName, '%'))")
    List<customProd> findByProductNameContainingIgnoreCase(@Param("productName") String productName);

    @Query("SELECT p FROM customProd p WHERE p.productRate >= :minPrice AND p.productRate <= :maxPrice")
    List<customProd> findProductsByPriceRange(double minPrice, double maxPrice);

    @Query("SELECT c FROM customProd c WHERE c.productCategory = :category")
    List<customProd> findByProductCategory(@Param("category") String productCategory);

    List<customProd> findByProductCategoryAndProductSubcategory(String productCategory, String productSubcategory);

    List<customProd> findByProductBrand(String productBrand);

    List<customProd> findByProductColor(String productColor);

    List<customProd> findByProductSize(String productSize);

    List<customProd> findByNewArrivalTrue();
    List<customProd> findBySacredOfferingsTrue();
}


