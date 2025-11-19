package com.wep.orders;

import java.util.Date;
import java.util.List;
import java.sql.Timestamp;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.joda.time.DateTime;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.wep.products.Products;
import com.wep.users.Address;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.Transient;


@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name="GOTHBOOK")
public class Orders{

	@Column(name = "COMPCODE")
	private int compCode;
	
	@Column(name = "TYPE")
	private String type;

	@Column(name = "AY")
	private int ay;

	@Column(name = "BILLNO")
	private int billNo;

	@Column(name = "SUFFIX")
	private String suffix;

	@Column(name = "SCRTYPE")
	private int scrType;

	@Id
	@Column(name = "SER_NO")
	private Long serialNo;

	@Column(name = "BILLDATE")
	private Date  billDate;
	
	@Column(name = "StatusUpdateDate")
	private Date  StatusUpdateDate;

	@Column(name = "PAR_CODE")
	private String userId;

	@Column(name = "PRD_CODE")
	private String productId;

	@Column(name = "GC")
	private String gc;

	@Column(name = "PRD_NAME")
	private String productName;

	@Column(name = "QUANTITY")
	private String orderQuantity;

	@Column(name = "BALQTY")
	private String stockQuantity;

	@Column(name = "RATE")
	private Double productRate;

	@Column(name = "AMOUNT")
	private Double productRateInDecimal;

	@Column(name = "HSN_SC")
	private String hsnCode;

	@Column(name ="BARSERIALNO")
	private String items;

	@Enumerated(EnumType.STRING)
	@Column(name ="MKPER",columnDefinition ="VARCHAR(255)")
	private OrderStatus orderStatus;
	
	@Column(name ="orderno")
	private int orderNo;
	
	@Column(name ="PAYMENT_METHOD")
	private String paymentMethod;
	
	@Enumerated(EnumType.STRING)
	@Column(name ="PAYMENT_STATUS",columnDefinition ="VARCHAR(255)")
	private PaymentStatus paymentStatus;
	
	@Column(name ="BQCODE")
	private String orderAddress;
	
	@Column(name="AMOUNTORD")
	private Double finalOrderAmount;

	@Transient
	private Products productObject;
	
	public Orders() {
		// TODO Auto-generated constructor stub
		
	}

	public int getCompCode() {
		return compCode;
	}

	public void setCompCode(int compCode) {
		this.compCode = compCode;
	}

	public String getType() {
		return type;
	}
	

	public PaymentStatus getPaymentStatus() {
		return paymentStatus;
	}

	public void setPaymentStatus(PaymentStatus paymentStatus) {
		this.paymentStatus = paymentStatus;
	}

	public void setType(String type) {
		this.type = type;
	}

	public int getAy() {
		return ay;
	}

	public void setAy(int ay) {
		this.ay = ay;
	}

	public int getBillNo() {
		return billNo;
	}

	public void setBillNo(int billNo) {
		this.billNo = billNo;
	}

	public String getSuffix() {
		return suffix;
	}
	

	public String getPaymentMethod() {
		return paymentMethod;
	}

	public void setPaymentMethod(String paymentMethod) {
		this.paymentMethod = paymentMethod;
	}

	public void setSuffix(String suffix) {
		this.suffix = suffix;
	}

	public int getScrType() {
		return scrType;
	}

	public void setScrType(int scrType) {
		this.scrType = scrType;
	}

	public Long getserialNo() {
		return serialNo;
	}

	public void setserialNo(Long serialNo) {
		this.serialNo = serialNo;
	}

	public Date  getBillDate() {
		return billDate;
	}

	public void setBillDate(Date  billDate) {
		this.billDate = billDate;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getProductid() {
		return productId;
	}

	public void setProductid(String productId) {
		this.productId = productId;
	}

	public String getGc() {
		return gc;
	}

	public void setGc(String gc) {
		this.gc = gc;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public String getOrderQuantity() {
		return orderQuantity;
	}

	public void setOrderQuantity(String orderQuantity) {
		this.orderQuantity = orderQuantity;
	}

	public String getStockQuantity() {
		return stockQuantity;
	}

	public void setStockQuantity(String stockQuantity) {
		this.stockQuantity = stockQuantity;
	}

	public Double getProductRate() {
		return productRate;
	}

	public void setProductRate(Double productRate) {
		this.productRate = productRate;
	}

	public Double getProductRateInDecimal() {
		return productRateInDecimal;
	}

	public void setProductRateInDecimal(Double productRateInDecimal) {
		this.productRateInDecimal = productRateInDecimal;
	}

	public String getHsnCode() {
		return hsnCode;
	}

	public void setHsnCode(String hsnCode) {
		this.hsnCode = hsnCode;
	}

	public String getItems() {
		return items;
	}

	public void setItems(String items) {
		this.items = items;
	}

	public OrderStatus getOrderStatus() {
		return orderStatus;
	}

	public void setOrderStatus(OrderStatus orderStatus) {
		this.orderStatus = orderStatus;
	}

	

	public int getOrderNo() {
		return orderNo;
	}

	public void setOrderNo(int orderNo) {
		this.orderNo = orderNo;
	}

	public String getOrderAddress() {
		return orderAddress;
	}

	public void setOrderAddress(String orderAddress) {
		this.orderAddress = orderAddress;
	}

	public Double getFinalOrderAmount() {
		return finalOrderAmount;
	}

	public void setFinalOrderAmount(Double finalOrderAmount) {
		this.finalOrderAmount = finalOrderAmount;
	}

	public Products getProductObject() {
		return productObject;
	}

	public void setProductObject(Products productObject) {
		this.productObject = productObject;
	}

	public Date getStatusUpdateDate() {
		return StatusUpdateDate;
	}

	public void setStatusUpdateDate(Date statusUpdateDate) {
		StatusUpdateDate = statusUpdateDate;
	}
	
	

	
}
