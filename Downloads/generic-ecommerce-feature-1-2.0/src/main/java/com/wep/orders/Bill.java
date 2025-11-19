package com.wep.orders;

import java.util.ArrayList;
import java.util.List;

import com.wep.users.Address;

public class Bill {
    private int billNo;
    private String orderImage;
    private Double orderTotalAmount;
    private Double productCount;
    private Address addressId;
    private List<Orders> orders;
    
    public Bill(int billNo) {
        this.billNo = billNo;
        this.orders = new ArrayList<>(); // Initialize the orders list
    }

    public void addOrder(Orders order) {
        orders.add(order);
    }
	
	public int getBillNo() {
		return billNo;
	}

	public void setBillNo(int billNo) {
		this.billNo = billNo;
	}

	public String getOrderImage() {
		return orderImage;
	}

	public void setOrderImage(String orderImage) {
		this.orderImage = orderImage;
	}

	public Double getOrderTotalAmount() {
		return orderTotalAmount;
	}

	public void setOrderTotalAmount(Double orderTotalAmount) {
		this.orderTotalAmount = orderTotalAmount;
	}

	public Double getProductCount() {
		return productCount;
	}

	public void setProductCount(Double productCount) {
		this.productCount = productCount;
	}

	public Address getAddressId() {
		return addressId;
	}

	public void setAddressId(Address addressId) {
		this.addressId = addressId;
	}

	public List<Orders> getOrders() {
		return orders;
	}

	public void setOrders(List<Orders> orders) {
		this.orders = orders;
	}

}

