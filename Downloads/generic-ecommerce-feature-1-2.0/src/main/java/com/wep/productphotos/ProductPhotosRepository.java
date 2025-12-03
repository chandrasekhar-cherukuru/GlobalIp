package com.wep.productphotos;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.wep.users.Users;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface ProductPhotosRepository extends JpaRepository<ProductPhotos, Long> {

	
	@Query("SELECT p FROM ProductPhotos p WHERE photoId =:photoId")
	ProductPhotos findAllPhotosWithPhotoID(@Param("photoId") Long photoId);
	
	@Query("SELECT p FROM ProductPhotos p WHERE p.products.productId = :productId")
    Optional<ProductPhotos> findAllPhotosWithProductID(@Param("productId") String productId);

    Optional<ProductPhotos> findByProductId(String productId);
	
//	@Query("SELECT p FROM ProductPhotos")
//	List<ProductPhotos> findAllPhotos();

}