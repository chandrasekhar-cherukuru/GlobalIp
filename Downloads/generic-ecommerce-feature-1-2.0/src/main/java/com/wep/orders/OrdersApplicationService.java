package com.wep.orders;


import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.wep.cart.Cart;
import com.wep.products.Products;
import com.wep.products.ProductsRepository;
import com.wep.users.Address;
import com.wep.users.Users;
import com.wep.users.UsersApplicationService;
import com.wep.users.UsersRepository;


@Service
public class OrdersApplicationService {

	@Autowired
	private final OrdersRepository rep;
	@Autowired
	private final ProductsRepository productRep;
	@Autowired
	private final UsersRepository usersRepo;
	@Autowired
	private final UsersApplicationService usersRep;
	
	public OrdersApplicationService(OrdersRepository rep, ProductsRepository productRep, UsersApplicationService usersRep, UsersRepository usersRepo) {
		this.rep = rep;
		this.productRep=productRep;
		this.usersRep = usersRep;
		this.usersRepo = usersRepo;
	}

	public Page<Orders> getAllOrders(Pageable pageable) {
	    return rep.findAll(pageable);
	}

	public Orders getOrderByID(Long orderId) {
		return rep.findById(orderId).orElse(null);
	}
	
	public boolean addOrder(String userId, Cart cartDraft, Integer countofProducts, Integer billNumber, Products productMaster, Double finalOrderAmount, String addrId, String paymentMethod) {
		Orders orderDraft=new Orders();
		Users users = usersRepo.findUserById(userId);
		orderDraft.setOrderStatus(OrderStatus.ORDERED);
		orderDraft.setStatusUpdateDate(new Date());
		orderDraft.setUserId(userId);
		orderDraft.setProductid(cartDraft.getProductid());
		orderDraft.setProductName(cartDraft.getProductName());
		orderDraft.setOrderQuantity(cartDraft.getOrderQuantity());
		if(paymentMethod.equalsIgnoreCase("COD")) {
			orderDraft.setPaymentStatus(PaymentStatus.PENDING);
		}
		else {
			orderDraft.setPaymentStatus(PaymentStatus.PAID);
		}
		if(null!=productMaster) {
		int quantity = (int) Double.parseDouble(cartDraft.getOrderQuantity());

		orderDraft.setStockQuantity(String.valueOf(Integer.parseInt(productMaster.getProductQuantity()) - quantity));
		int orderquantity = (int) Double.parseDouble(cartDraft.getOrderQuantity());
		
		orderDraft.setProductRateInDecimal(cartDraft.getProductRate() * orderquantity);
		orderDraft.setProductRate(cartDraft.getProductRate());
		orderDraft.setHsnCode(cartDraft.getHsnCode());
		orderDraft.setCompCode(1);
		orderDraft.setPaymentMethod(paymentMethod);
		orderDraft.setBillNo(billNumber);
		orderDraft.setType("EC");
		orderDraft.setAy(1);
	    orderDraft.setSuffix("EC");
	    orderDraft.setScrType(1);
	    orderDraft.setGc("GC");
	    orderDraft.setserialNo(cartDraft.getserialNo());
	    orderDraft.setFinalOrderAmount(finalOrderAmount);
	    orderDraft.setBillDate(new Date());
	    switch (addrId.toString()) {
		    case "3":
		        orderDraft.setOrderAddress(users.getAddress3());
		        break;
		    case "2":
		        orderDraft.setOrderAddress(users.getAddress2());
		        break;
		    default:
		        orderDraft.setOrderAddress(users.getAddress1());
		        break;
	    }

	    rep.save(orderDraft);
	    productMaster.setProductQuantity(String.valueOf(Integer.parseInt(productMaster.getProductQuantity()) - quantity));
	    productRep.save(productMaster);
	    return true;
		}
	    return false;
	}	
	
	
	public boolean updateOrderStatus(Long orderId, String newStatus) {
	    Orders order = rep.findById(orderId).orElse(null);
	    if (order == null) {
	        return false;
	    }

	    // Validate the new status
	    try {
	        OrderStatus orderStatus = OrderStatus.fromString(newStatus);
	        order.setOrderStatus(orderStatus);
			order.setStatusUpdateDate(new Date());
	        rep.save(order);
	    } catch (IllegalArgumentException e) {
	        return false;
	    }

	    return true;
	}
	
	
	public boolean updatePaymentStatus(Long orderId, String newStatus) {
	    Orders order = rep.findById(orderId).orElse(null);
	    if (order == null) {
	        return false;
	    }
	    try {
	        PaymentStatus paymentStatus = PaymentStatus.fromString(newStatus);
	        order.setPaymentStatus(paymentStatus); 
	        rep.save(order);
	    } catch (IllegalArgumentException e) {
	        return false;
	    }

	    return true;
	}
	
	
	public List<Bill> mapOrdersList(String userId) {
	    List<Bill> billList = new ArrayList<>();
	    List<Orders> ordersList = rep.findOrdersByUserId(userId);

	    Map<Integer, Bill> billMap = new HashMap<>();

	    for (Orders order : ordersList) {
	        int billNo = order.getBillNo();
	        Bill bill;

	        if (billMap.containsKey(billNo)) {
	            bill = billMap.get(billNo);
	        } else {
	            bill = new Bill(billNo);

	            Products product = productRep.findProductDetailsWithProductId(order.getProductid());
	            if (null != product.getProductPhotos() && !product.getProductPhotos().isEmpty()) {
	                bill.setOrderImage(product.getProductPhotos().get(0).getPhotoName());
	            } else {
	                bill.setOrderImage("photo.jpg");
	            }
	            Address orderAddress = setOrderAddressfromStringToAddress(order);
	            bill.setAddressId(orderAddress);
	            billMap.put(billNo, bill);
	        }

	        Double currentTotalAmount = order.getProductRateInDecimal();
	        if (currentTotalAmount != null) {
	            if (bill.getOrderTotalAmount() == null) {
	                bill.setOrderTotalAmount(currentTotalAmount);
	            } else {
	                bill.setOrderTotalAmount(bill.getOrderTotalAmount() + currentTotalAmount);
	            }
	        }

	        // Increment the product count for the bill
	        if (bill.getProductCount() == null) {
	            bill.setProductCount(1.0);
	        } else {
	            bill.setProductCount(bill.getProductCount() + 1);
	        }
	        order.setProductObject(productRep.findProductDetailsWithProductId(order.getProductid()));

	        bill.addOrder(order);
	    }

	    // Convert the billMap to a list and sort it in descending order
	    List<Bill> sortedBillList = new ArrayList<>(billMap.values());
	    Collections.sort(sortedBillList, (bill1, bill2) -> Integer.compare(bill2.getBillNo(), bill1.getBillNo()));

	    return sortedBillList;
	}


	private Address setOrderAddressfromStringToAddress(Orders order) {
		if (null != order.getOrderAddress()) {
			String orderAddress = order.getOrderAddress();
			String[] addressParts = orderAddress.split("@");

			if (addressParts.length == 12) {
				Address newAddress = new Address();
				newAddress.setAddrId(addressParts[0]);
				newAddress.setName(addressParts[1]);
				newAddress.setMobile(addressParts[2]);
				newAddress.setHouseName(addressParts[3]);
				newAddress.setStreet(addressParts[4]);
				newAddress.setLandMark(addressParts[5]);
				newAddress.setCity(addressParts[6]);
				newAddress.setState(addressParts[7]);
				newAddress.setPinCode(addressParts[8]);
				newAddress.setCountry(addressParts[9]);
				newAddress.setAddrType(addressParts[10]);
				newAddress.setCountryCode(addressParts[11]);

				// Optionally, set countryCode if available in the order address
				if (addressParts.length > 11) {
					newAddress.setCountryCode(addressParts[11]);
				}

				return newAddress;
			} else {
				// Handle the case where the order address doesn't have all expected components
				Address newAddress = new Address();
				newAddress.setAddrId("");
				newAddress.setName("");
				newAddress.setMobile("");
				newAddress.setHouseName("");
				newAddress.setStreet("");
				newAddress.setLandMark("");
				newAddress.setCity("");
				newAddress.setState("");
				newAddress.setPinCode("");
				newAddress.setCountry("");
				newAddress.setAddrType("");
				newAddress.setCountryCode("");
				return newAddress; // Or throw an exception, depending on your use case
			}
		}
		Address newAddress = new Address();
		newAddress.setAddrId("");
		newAddress.setName("");
		newAddress.setMobile("");
		newAddress.setHouseName("");
		newAddress.setStreet("");
		newAddress.setLandMark("");
		newAddress.setCity("");
		newAddress.setState("");
		newAddress.setPinCode("");
		newAddress.setCountry("");
		newAddress.setAddrType("");
		newAddress.setCountryCode("");
		return newAddress;
	}


	  public Page<Bill> mapOrdersListForAllProducts(int page, int size) {
	        Pageable pageable = PageRequest.of(page, size);
	        Page<Orders> ordersPage = rep.findAll(pageable);

	        // Fetching a page of orders
	        List<Orders> ordersList = ordersPage.getContent();

	        Map<Integer, Bill> billMap = new HashMap<>();

	        for (Orders order : ordersList) {
	            int billNo = order.getBillNo();
	            Bill bill;

	            if (billMap.containsKey(billNo)) {
	                bill = billMap.get(billNo);
	            } else {
	                bill = new Bill(billNo);

	                // Initialize Bill attributes
	                Products product = productRep.findProductDetailsWithProductId(order.getProductid());
	                if (null != product.getProductPhotos() && !product.getProductPhotos().isEmpty()) {
	                    bill.setOrderImage(product.getProductPhotos().get(0).getPhotoName());
	                } else {
	                    bill.setOrderImage("photo.jpg");
	                }

	                Address orderAddress = setOrderAddressfromStringToAddress(order);
	                bill.setAddressId(orderAddress);
	                billMap.put(billNo, bill);
	            }

	            // Update the total order amount for the bill
	            Double currentTotalAmount = order.getProductRateInDecimal();
	            if (currentTotalAmount != null) {
	                if (bill.getOrderTotalAmount() == null) {
	                    bill.setOrderTotalAmount(currentTotalAmount);
	                } else {
	                    bill.setOrderTotalAmount(bill.getOrderTotalAmount() + currentTotalAmount);
	                }
	            }

	            // Increment the product count for the bill
	            if (bill.getProductCount() == null) {
	                bill.setProductCount(1.0);
	            } else {
	                bill.setProductCount(bill.getProductCount() + 1);
	            }

	            order.setProductObject(productRep.findProductDetailsWithProductId(order.getProductid()));
	            bill.addOrder(order);
	        }

	        // Convert the billMap to a list and sort it in descending order
	        List<Bill> sortedBillList = new ArrayList<>(billMap.values());
	        Collections.sort(sortedBillList, Comparator.comparingInt(Bill::getBillNo).reversed());

	        return new PageImpl<>(sortedBillList, pageable, ordersPage.getTotalElements());
	    }

		public String changeDelStatus(String userId, String billNo, OrderStatus status) {
			List<Orders> orderList = rep.findOrdersByUserIdAndBillID(userId, billNo);
			if (null != orderList) {
				for (Orders orderind : orderList) {
					orderind.setOrderStatus(status);
					rep.save(orderind);
				}
				return "Order Status Changed";
			}
			return null;
		}


}
