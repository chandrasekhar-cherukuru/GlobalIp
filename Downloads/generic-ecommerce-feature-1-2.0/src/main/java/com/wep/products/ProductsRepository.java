package com.wep.products;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface ProductsRepository extends JpaRepository<Products, String> {

	@Query("SELECT p FROM Products p WHERE p.productPrice BETWEEN :minPrice AND :maxPrice")
	Page<Products> findByProductPriceBetween(@Param("minPrice")Double minPrice, @Param("maxPrice")Double maxPrice, Pageable pageable);

//	Page<Products> findAll(Pageable pageable);

	@Query("SELECT p FROM Products p WHERE p.isProductHidden = true")
	List<Products> findHiddenFalse();

	@Query("SELECT p FROM Products p ORDER BY p.createdTime ASC")
	Page<Products> findAllOrderByDateAsc(Pageable pageable);

	//List<Products> findByNameContainingIgnoreCase(String name);

	@Query("SELECT p FROM Products p WHERE p.productId =:productId")
	Products findProductDetailsByQuery(@Param("productId") String productId);

	@Query("SELECT DISTINCT p FROM Products p LEFT JOIN FETCH p.productPhotos WHERE p.isProductHidden = False")
	List<Products> findAllWithProductPhotos();
	
	@Query("SELECT DISTINCT p FROM Products p LEFT JOIN FETCH p.productPhotos WHERE p.isProductHidden = True")
	List<Products> findAllWithProductPhotosHidden();
	
	@Query("SELECT p FROM Products p LEFT JOIN FETCH p.productPhotos WHERE p.productId = :id")
    Products findProductDetailsWithPhotosByQuery(@Param("id") String id);
	
    Page<Products> findAll(Specification<Products> spec, Pageable pageable);
    
    @Query("SELECT p FROM Products p WHERE p.productId = :productId")
    Products findProductDetailsWithProductId(@Param("productId") String productId);
    
    @Query("SELECT p FROM Products p WHERE p.productId = :productId")
    List<Products> findProductsByProductId(@Param("productId") String productId);
    
    @Query("SELECT p FROM Products p WHERE p.productName LIKE %:productName%")
    List<Products> findProductDetailsByProductName(@Param("productName") String productName);
    
    @Query("SELECT p FROM Products p WHERE p.productName LIKE %:productName%")
    Page<Products> findProductDetailsByProductNamePaged(@Param("productName") String productName, Pageable pageable);



}