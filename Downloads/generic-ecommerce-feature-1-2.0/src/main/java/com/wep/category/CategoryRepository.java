package com.wep.category;


import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.wep.products.Products;
import com.wep.users.Users;


@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

@Query("SELECT o FROM Orders o where o.userId =:userId")
List<Category> getOrderByUserID(@Param("userId") Long userId);

@Query("SELECT DISTINCT c FROM Category c LEFT JOIN FETCH c.subcategoryList")
List<Category> findAllWithSubcategory();

@Query("SELECT c FROM Category c WHERE c.categoryName = :categoryName")
List<Category> findWithCategoryName(@Param("categoryName") String categoryName);

Category findByCategoryName(String categoryName);

boolean existsByCategoryName(String categoryName);

@Query("SELECT c FROM Category c WHERE c.isCategoryHidden = :hidden")
List<Category> findAllByIsCategoryHidden(@Param("hidden") boolean hidden);



}