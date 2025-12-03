package com.wep.cart;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;

import com.wep.mail.CustomMailStructure;
import com.wep.mail.MailApplicationService;
import com.wep.orders.OrdersApplicationService;
import com.wep.productphotos.ProductPhotos;
import com.wep.products.Products;
import com.wep.products.ProductsRepository;
import com.wep.users.Users;
import com.wep.users.UsersRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;


@Service
public class CartApplicationService {

	@Autowired
	private final CartRepository rep;
	
	
	@Autowired
	private final ProductsRepository productRep;

	@Autowired
	private final UsersRepository usersRep;
	@Autowired
	private final OrdersApplicationService orderApplicationService;
	@Autowired
	private final MailApplicationService mailService;
	
	public CartApplicationService(CartRepository rep, ProductsRepository productRep, UsersRepository usersRep, OrdersApplicationService orderApplicationService, MailApplicationService mailService) {
		this.rep = rep;
		this.productRep=productRep;
		this.usersRep=usersRep;
		this.orderApplicationService=orderApplicationService;
		this.mailService=mailService;
	}

	public Page<Cart> getAllProducts(Pageable pageable) {
	    return rep.findAll(pageable);
	}



	public List<Cart> getProductsInCartByUserIdAndProductId(String userId,String productId) {
		return rep.findByUserIdAndProductId(productId, productId);
	}

//	public List<Cart> filterAndProcessCartItems(String userId) {
//	    List<Cart> cartList = rep.findByUserId(userId);
//
//	    List<Cart> itemsToDelete = new ArrayList<>();
//
//	    for (Cart cartItem : cartList) {
//	        Products productMaster = productRep.findProductDetailsWithProductId(cartItem.getProductid());
//
//	        if (productMaster != null) {
//	            processCartItemWithProductMaster(cartItem, productMaster);
//	        } else {
//	            // Handle the case where the product doesn't exist in productMaster (if needed)
//	            itemsToDelete.add(cartItem);
//	        }
//	    }
//
//	    // Delete items to be removed in one go
//	    rep.deleteAll(itemsToDelete);
//
//	    // You can update the cartList directly, no need to clear and re-add
//	    // as the cartList now only contains valid products
//	    rep.saveAll(cartList);
//
//	    return cartList;
//	}

	@Transactional
	public List<Cart> filterAndProcessCartItems(String userId, int pageNumber, int pageSize) {
	    // Fetch all cart items for the user
	    List<Cart> cartList = rep.findByUserId(userId);

	    List<Cart> itemsToDelete = new ArrayList<>();

	    // Perform manual pagination
	    int startIndex = pageNumber * pageSize;
	    int endIndex = Math.min(startIndex + pageSize, cartList.size());

	    List<Cart> pageCartItems = new ArrayList<>();

	    for (int i = startIndex; i < endIndex; i++) {
	        Cart cartItem = cartList.get(i);
	        Products productMaster = productRep.findProductDetailsWithProductId(cartItem.getProductid());

	        if (productMaster != null) {
	            processCartItemWithProductMaster(cartItem, productMaster);
	        } else {
	            // Handle the case where the product doesn't exist in productMaster (if needed)
	            itemsToDelete.add(cartItem);
	        }

	        pageCartItems.add(cartItem);
	    }

	    // Remove items to be deleted from the original cartList
	    cartList.removeAll(itemsToDelete);

	    return pageCartItems;
	}



	private void processCartItemWithProductMaster(Cart cartItem, Products productMaster) {
	    cartItem.setGstNo(productMaster.getGstNo());
	    cartItem.setHsnCode(productMaster.getHsnSc());
	    cartItem.setProductName(productMaster.getProductName());
	    cartItem.setProductRate(productMaster.getProductPrice());
	    cartItem.setProductDescription(productMaster.getPrdDesc());
	    cartItem.setStockQuantity(productMaster.getProductQuantity());
	    List<ProductPhotos> photos = productMaster.getProductPhotos();
	    if (photos != null && !photos.isEmpty()) {
	        cartItem.setProductImage(photos.get(0).getPhotoName());
	    }
	}

	public List<Cart> getProductsInCartByAndProductId(String productId) {
		return rep.findByProductId(productId);
	}
	
	
	@Transactional
	public Boolean addProductToCart(String userId, String productId, String orderQuantity) {
	    try {
	        // Validate input parameters
	        if (userId == null || userId.isEmpty() || productId == null || productId.isEmpty() || orderQuantity == null || orderQuantity.isEmpty()) {
	            throw new IllegalArgumentException("userId, productId, and orderQuantity cannot be null or empty.");
	        }

	        // Parse order quantity
	        int quantity = Integer.parseInt(orderQuantity);
	        if (quantity <= 0) {
	            throw new IllegalArgumentException("orderQuantity must be a positive integer.");
	        }

	        // Find the product
	        Products product = productRep.findProductDetailsByQuery(productId);
	        if (product == null) {
	            throw new IllegalArgumentException("Product with ID " + productId + " does not exist.");
	        }

	        // Retrieve existing cart entry if it exists
	        Cart cartEntry = rep.findByProductIdAndUserId(productId, userId);
	        if (cartEntry != null) {
	            // Update existing entry
	            cartEntry.setOrderQuantity(orderQuantity);
	            cartEntry.setProductRate(product.getProductPrice());
	            cartEntry.setProductRateInDecimal(product.getProductPrice() * quantity);
	            // Modify other cartEntry properties as needed
	        } else {
	            // Create new cart entry
	            cartEntry = new Cart();
	            cartEntry.setCompCode(1); // Or retrieve dynamically
	            cartEntry.setType("EC"); // Or retrieve dynamically
	            cartEntry.setAy(1); // Or retrieve dynamically
	            cartEntry.setBillNo(0); // Or retrieve dynamically
	            cartEntry.setScrType(1); // Or retrieve dynamically
	            cartEntry.setSuffix("EC"); // Or retrieve dynamically
	            cartEntry.setUserId(userId);
	            cartEntry.setProductid(productId);
	            cartEntry.setProductName(product.getProductName());
	            cartEntry.setOrderQuantity(orderQuantity);
	            cartEntry.setStockQuantity(""); // Set as needed
	            cartEntry.setProductRate(product.getProductPrice());
	            cartEntry.setProductRateInDecimal(product.getProductPrice() * quantity);
	            cartEntry.setHsnCode(product.getHsnSc());
	            cartEntry.setGstNo(product.getGstNo());
	            // Set other properties as needed
	        }

	        // Save the cart entry
	        rep.save(cartEntry);

	        return true;
	    } catch (NumberFormatException e) {
	        System.err.println("Error parsing orderQuantity: " + e.getMessage());
	        return false;
	    } catch (IllegalArgumentException | IllegalStateException e) {
	        System.err.println("Error adding product to cart: " + e.getMessage());
	        return false;
	    } catch (Exception e) {
	        System.err.println("Unexpected error: " + e.getMessage());
	        return false;
	    }
	}



	@Transactional
	public Boolean updateProductsInCart(String userId, String productId, String orderQuantity) {
	    Products product = productRep.findProductDetailsByQuery(productId);
	    if (product == null) {
	        return false;
	    }
	    try {
	        int quantity = Integer.parseInt(orderQuantity);
	        Cart c = rep.findByProductIdAndUserId(productId, userId);
	        if (c == null) {
	            return false;
	        }
	        //Integer newStock = Integer.parseInt(product.getProductQuantity()) - quantity;
	        c.setOrderQuantity(String.valueOf(quantity));
	        c.setStockQuantity(String.valueOf(product.getProductQuantity()));
	        c.setProductRateInDecimal(quantity * product.getProductPrice());
	        rep.save(c);
	        return true;
	    } catch (NumberFormatException e) {
	        return false;
	    }
	}


	 @Transactional
		public void removeProductFromCartBy(String userId, String productId) {
			// First, check if the user has the product in the cart
		 Cart u=rep.findByProductIdAndUserId(productId, userId);

			if (u.getUserId().equals(userId) && u.getProductid().equals(productId)) {
				// Product already in cart, no need to add it again
				rep.delete(u);
			} else {
				// Handle the case when the product is not found in the user's cart
				throw new IllegalArgumentException("Product not found in the user's cart.");
			}
		}
	 
	 

		@Transactional
		public List<Cart> cartOrderFinalizing(String userId, Double finalOrderAmount,String addrId, String paymentMethod) {
			//Save Cart product
			List<Products> invalidProducts = new ArrayList<>();
			List<Cart> userCartProducts = vaidateMasterQuantity(userId, invalidProducts);
			if (!userCartProducts.isEmpty()) {
				System.out.println(userCartProducts);
				return userCartProducts;
			}
			Integer latestBillNumber = rep.findLatestBillNumber(); // Replace with the actual method to fetch the latest bill number

		    // Step 2: Increment the latest bill number by 1
		    Integer newBillNumber = latestBillNumber + 1;
		    Integer billSequence = newBillNumber;
			List<Cart> failedCarts = new ArrayList<>();
			List<Cart> userCartProductsToBePersisted = rep.findByUserId(userId);
			for (Cart cartToOrder : userCartProductsToBePersisted) {
				Products productMaster = productRep.findProductDetailsWithProductId(cartToOrder.getProductid());
				if (null != productMaster) {
					boolean isAddedtoOthBook = orderApplicationService.addOrder(userId, cartToOrder,
							userCartProducts.size(), billSequence, productMaster, finalOrderAmount, addrId, paymentMethod);
					//mail
//					CustomMailStructure customMailStructure = new CustomMailStructure();
//					customMailStructure.setUserId(userId);
//					customMailStructure.setOrderId(billSequence.toString());
//					mailService.buildEmailBody(customMailStructure);
					if (!isAddedtoOthBook) {
						failedCarts.add(cartToOrder);
					}
					if (isAddedtoOthBook) {
						rep.delete(cartToOrder);
					}
				}
			}
			return failedCarts;
		}



	

		private List<Cart> vaidateMasterQuantity(String userId, List<Products> invalidProducts) {
			List<Cart> listOfInvalidProductsinCart = new ArrayList<>();
			List<Cart> userCartProducts = rep.findByUserId(userId);
			System.out.println(userCartProducts.toString());
			for (Cart cartproduct : userCartProducts) {
				int quantity = (int) Double.parseDouble(cartproduct.getOrderQuantity());
				Products product = productRep.findProductDetailsWithProductId(cartproduct.getProductid());
				if (null != product) {
					String masterQuantityString = product.getProductQuantity();
					double masterQuantityDouble = Double.parseDouble(masterQuantityString);
					int masterProductquantity = (int) masterQuantityDouble;
					if (quantity > masterProductquantity) {
						listOfInvalidProductsinCart.add(cartproduct);
					}
				}
			}
			return listOfInvalidProductsinCart;
		}
		
		
		public String countofProductsInCart(String userId) {
			return rep.countUniqueProductsInCartAsString(userId);
			
		}

		 public Page<Map<String, String>> findDistinctUserIdsWithNames(int page, int size) {
		        PageRequest pageable = PageRequest.of(page, size);
		        Page<String> listofUserId = rep.findDistinctUserIds(pageable);

		        return listofUserId.map(userId -> {
		            Users user = usersRep.findUserById(userId);
		            Map<String, String> userMap = new HashMap<>();
		            userMap.put("userId", userId);
		            userMap.put("userName", user != null ? user.getParName() : null);
		            return userMap;
		        });
		    }
}