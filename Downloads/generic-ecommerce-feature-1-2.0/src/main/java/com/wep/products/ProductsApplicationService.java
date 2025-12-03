package com.wep.products;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wep.cart.Cart;
import com.wep.cart.CartApplicationService;
import com.wep.cart.CartRepository;
import com.wep.productphotos.ProductPhotos;
import com.wep.productphotos.ProductPhotosRepository;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Selection;
import jakarta.persistence.criteria.Subquery;
import jakarta.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

@Service
public class ProductsApplicationService {

	@Autowired
	private final ProductsRepository rep;
	@Autowired
	private final ProductSearchNamesList productSearchNamesList;
	@Autowired
	private final CartApplicationService cartService;
	@Autowired
    private final ProductPhotosRepository productPhotosRepository; 

	public ProductsApplicationService(ProductsRepository rep, ProductSearchNamesList productSearchNamesList,
			CartApplicationService cartService, ProductPhotosRepository productPhotosRepository) {
		this.rep = rep;
		this.productSearchNamesList = productSearchNamesList;
		this.cartService = cartService;
		this.productPhotosRepository = productPhotosRepository;
	}

	public List<Products> getAllProducts() {
		List<Products> listproduct = rep.findAllWithProductPhotos();
		return listproduct;
	}
	public List<Products> getAllHiddenProducts() {
		List<Products> listproduct = rep.findAllWithProductPhotosHidden();
		return listproduct;
	}

	public Products getProductByID(String id, String userId) {
		Products product = rep.findProductDetailsWithPhotosByQuery(id);

		if (product != null) {
			if (product.getCartObject() != null && !product.getCartObject().isEmpty()) {
				Cart matchingCart = product.getCartObject().stream().filter(cart -> userId.equals(cart.getUserId()))
						.findFirst().orElse(null);

				if (matchingCart != null) {
					product.setCartObject(Collections.singletonList(matchingCart));
				}
			} else {
				Cart dummyCart = new Cart();
				dummyCart.setOrderQuantity("0");
				product.setCartObject(Collections.singletonList(dummyCart));
			}
		}

		return product;
	}

	public List<Products> getProductsByPageAndPageSize(int pageNumber, int pageSize) {
		Pageable pageable = PageRequest.of(pageNumber, pageSize);
		Page<Products> productPage = rep.findAll(pageable);
		return productPage.getContent();
	}

	public List<Products> findByIsHiddenFalse() {
		return rep.findHiddenFalse();
	}

	public Page<Products> findAllByDate(int pageNumber, int pageSize, String userId) {
		Pageable pageable = PageRequest.of(pageNumber, pageSize);
		Page<Products> queryResult = rep.findAllOrderByDateAsc(pageable);

		// Post-process the results to handle cartObject
		List<Products> results = queryResult.getContent();
		for (Products product : results) {
			if (product.getCartObject() != null && !product.getCartObject().isEmpty()
					&& product.getCartObject().get(0).getUserId().equals(userId)) {
				// Find the matching Cart object by userId and return its orderQuantity
				Cart matchingCart = product.getCartObject().stream().filter(cart -> userId.equals(cart.getUserId()))
						.findFirst().orElse(null);

				if (matchingCart != null) {
					product.setCartObject(Collections.singletonList(matchingCart));
				}
			} else {
				// Handle the case where cartObject is null
				// Create a new Cart object with orderQuantity 0
				Cart dummyCart = new Cart();
				dummyCart.setOrderQuantity("0");
				product.setCartObject(Collections.singletonList(dummyCart));
			}
		}

		// Create a new Page with the post-processed results
		return new PageImpl<>(results, pageable, queryResult.getTotalElements());
	}

	public List<String> autoCompleteSearchBar(String name) {
		List<String> suggestedwordList = productSearchNamesList.suggestWords(name);
		return suggestedwordList;
	}

	public Page<Products> filterProducts(Double minPrice, Double maxPrice, Boolean orderByAsc, String category,
			String subcategoryId, Boolean newArrival, String searchName, int pageNumber, int pageSize, String userId) {
		Pageable pageable;
		if (orderByAsc) {
			pageable = PageRequest.of(pageNumber, pageSize, Sort.by("productPrice").ascending());
		} else {
			pageable = PageRequest.of(pageNumber, pageSize, Sort.by("productPrice").descending());
		}

		Specification<Products> spec = Specification.where(null);

		if (minPrice != null) {
			spec = spec.and((root, query, builder) -> builder.greaterThanOrEqualTo(root.get("productPrice"), minPrice));
		}
		if (maxPrice != null) {
			spec = spec.and((root, query, builder) -> builder.lessThanOrEqualTo(root.get("productPrice"), maxPrice));
		}
		if (category != null) {
			spec = spec.and((root, query, builder) -> builder.equal(root.get("categoryId"), category));
		}
		if (subcategoryId != null) {
			if (!subcategoryId.isEmpty()) {
				String[] subcategoryIds = subcategoryId.split(",");
				spec = spec.and((root, query, builder) -> root.get("subcategoryId").in((Object[]) subcategoryIds));
			}
		}
		if (newArrival) {
			pageable = PageRequest.of(pageNumber, pageSize, Sort.by("createdTime").descending());
		}
		if (searchName != null) {
			spec = spec.and((root, query, builder) -> builder.like(builder.lower(root.get("productName")),
					"%" + searchName.toLowerCase() + "%"));
		}

		// Perform the query
		Page<Products> queryResult = rep.findAll(spec, pageable);

		// Post-process the results to handle cartObject
		List<Products> results = queryResult.getContent();
		for (Products product : results) {
			if (product.getCartObject() != null && !product.getCartObject().isEmpty()) {
				// Find the matching Cart object by userId and return its orderQuantity
				Cart matchingCart = product.getCartObject().stream().filter(cart -> userId.equals(cart.getUserId()))
						.findFirst().orElse(null);

				if (matchingCart != null) {
					product.setCartObject(Collections.singletonList(matchingCart));
				} else {
					// Handle the case where cartObject is null
					// Create a new Cart object with orderQuantity 0
					Cart dummyCart = new Cart();
					dummyCart.setOrderQuantity("0");
					product.setCartObject(Collections.singletonList(dummyCart));
				}
			} else {
				// Handle the case where cartObject is null
				// Create a new Cart object with orderQuantity 0
				Cart dummyCart = new Cart();
				dummyCart.setOrderQuantity("0");
				product.setCartObject(Collections.singletonList(dummyCart));
			}
		}

		// Create a new Page with the post-processed results
		return new PageImpl<>(results, pageable, queryResult.getTotalElements());
	}

	public boolean saveProduct(Products product) {
		if (product == null) {
			throw new IllegalArgumentException("Product data is required.");
		}
		rep.save(product);
		return true; // Product successfully saved
	}
	@Transactional
	public boolean updateProduct(String productId, Products updatedProduct) {
	    if (updatedProduct == null) {
	        throw new IllegalArgumentException("Updated product data is required.");
	    }

	    Products existingProduct = rep.findById(productId)
	        .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));

	    // Update the fields of the existing product with the new values, if present
	    if (updatedProduct.getProductName() != null) {
	        existingProduct.setProductName(updatedProduct.getProductName());
	    }
	    if (updatedProduct.getProductQuantity() != null) {
	        existingProduct.setProductQuantity(updatedProduct.getProductQuantity());
	    }
	    if (updatedProduct.getProductPrice() != null) {
	        existingProduct.setProductPrice(updatedProduct.getProductPrice());
	    }
	    if (updatedProduct.getPurRate() != null) {
	        existingProduct.setPurRate(updatedProduct.getPurRate());
	    }
	    if (updatedProduct.getMrp() != null) {
	        existingProduct.setMrp(updatedProduct.getMrp());
	    }

	    if (updatedProduct.getVatRate() != null) {
	        existingProduct.setVatRate(updatedProduct.getVatRate());
	    }
	    if (updatedProduct.getCategory() != null) {
	        existingProduct.setCategory(updatedProduct.getCategory());
	    }
	    if (updatedProduct.getBrand() != null) {
	        existingProduct.setBrand(updatedProduct.getBrand());
	    }
	    if (updatedProduct.getBox() != null) {
	        existingProduct.setBox(updatedProduct.getBox());
	    }
	    if (updatedProduct.getWeight() != null) {
	        existingProduct.setWeight(updatedProduct.getWeight());
	    }
	    if (updatedProduct.getHsnSc() != null) {
	        existingProduct.setHsnSc(updatedProduct.getHsnSc());
	    }
	    if (updatedProduct.getCreatedBy() != null) {
	        existingProduct.setCreatedBy(updatedProduct.getCreatedBy());
	    }
	    if (updatedProduct.getCreatedTime() != null) {
	        existingProduct.setCreatedTime(updatedProduct.getCreatedTime());
	    }
	    if (updatedProduct.getModifiedBy() != null) {
	        existingProduct.setModifiedBy(updatedProduct.getModifiedBy());
	    }
	    if (updatedProduct.getModifiedTime() != null) {
	        existingProduct.setModifiedTime(updatedProduct.getModifiedTime());
	    }
	    if (updatedProduct.getImage() != null) {
	        existingProduct.setImage(updatedProduct.getImage());
	    }
	    if (updatedProduct.getPrdDesc() != null) {
	        existingProduct.setPrdDesc(updatedProduct.getPrdDesc());
	    }
	    if (updatedProduct.getMinStk() != null) {
	        existingProduct.setMinStk(updatedProduct.getMinStk());
	    }
	    if (updatedProduct.getPrdPurity() != null) {
	        existingProduct.setPrdPurity(updatedProduct.getPrdPurity());
	    }
	    if (updatedProduct.getCategoryId() != null) {
	        existingProduct.setCategoryId(updatedProduct.getCategoryId());
	    }
	    if (updatedProduct.getSubcategoryId() != null) {
	        existingProduct.setSubcategoryId(updatedProduct.getSubcategoryId());
	    }
	    if (updatedProduct.getGstNo() != null) {
	        existingProduct.setGstNo(updatedProduct.getGstNo());
	    }

	    // Save the updated product
	    rep.save(existingProduct);
	    return true; // Product successfully updated
	}


	public boolean deleteProduct(String productId) {
		Optional<ProductPhotos> productPhotos = productPhotosRepository.findByProductId(productId);
		if (productPhotos.isPresent()) {
			productPhotosRepository.delete(productPhotos.get());
		}
		Optional<Products> product = rep.findById(productId);
		if (product.isPresent()) {
			rep.delete(product.get());
			return true;
		}
		return false;
	}
	
	public boolean updateProductVisibility(String productId, boolean hide) {
	    Optional<Products> product = rep.findById(productId);
	    if (product.isPresent()) {
	        Products updatedProduct = product.get();
	        updatedProduct.setProductHidden(hide);
	        rep.save(updatedProduct);
	        return true;
	    }
	    return false;
	}

	public List<Products> processProducts(List<Products> products, String userId) {
		List<Products> results = new ArrayList<>();

		for (Products product : products) {
			if (product.getCartObject() != null && !product.getCartObject().isEmpty()) {
				Cart matchingCart = product.getCartObject().stream().filter(cart -> userId.equals(cart.getUserId()))
						.findFirst().orElse(null);

				if (matchingCart != null) {
					product.setCartObject(Collections.singletonList(matchingCart));
				} else {
					// Handle the case where cartObject is null
					// Create a new Cart object with orderQuantity 0
					Cart dummyCart = new Cart();
					dummyCart.setOrderQuantity("0");
					product.setCartObject(Collections.singletonList(dummyCart));
				}
			} else {
				Cart dummyCart = new Cart();
				dummyCart.setOrderQuantity("0");
				product.setCartObject(Collections.singletonList(dummyCart));
			}

			results.add(product);
		}

		// Shuffle the list of results randomly
		Collections.shuffle(results, new Random(System.currentTimeMillis()));

		return results;
	}

	    public String generateProductId() {
	        // Implement your logic to generate a unique product ID
	        // You can use UUID or any other logic to generate the ID
	        return UUID.randomUUID().toString(); // Example: Using UUID
	    }
}
