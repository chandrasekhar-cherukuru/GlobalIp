package com.wep.cart;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.wep.products.Products;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "gecom_cart")
public class Cart {

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
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "SER_NO")
	private Long serialNo;

	@Column(name = "BILLDATE")
	private LocalDateTime billDate;

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

	@Column(name = "PRD_UNIT")
	private String stockQuantity;

	@Column(name = "RATE")
	private Double productRate;

	@Column(name = "AMOUNT")
	private Double productRateInDecimal;

	@Column(name = "HSN_SC")
	private String hsnCode;

	@Column(name = "ORDERNO")
	private int orderNo;

	@Column(name = "GST_NO")
	private String gstNo;
	
	@Transient
	private String productDescription;
	 
	@Transient
	private String productImage;

	
	@ManyToOne
	@JoinColumn(name = "PRD_CODE", insertable = false, updatable = false)
	@JsonBackReference
	private Products productsObject;
	
	public Cart(String productId, String productName, String orderQuantity, Double productRate, String hsnCode,
			String gstNo) {
		super();
		this.productId = productId;
		this.productName = productName;
		this.orderQuantity = orderQuantity;
		this.productRate = productRate;
		this.hsnCode = hsnCode;
		this.gstNo = gstNo;
	}

	
	public Cart() {
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

	public LocalDateTime getBillDate() {
		return billDate;
	}

	public void setBillDate(LocalDateTime billDate) {
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

	public int getOrderNo() {
		return orderNo;
	}

	public void setOrderNo(int orderNo) {
		this.orderNo = orderNo;
	}

	public String getGstNo() {
		return gstNo;
	}

	public void setGstNo(String gstNo) {
		this.gstNo = gstNo;
	}
	public Products getProductsObject() {
		return productsObject;
	}
	public void setProductsObject(Products productsObject) {
		this.productsObject = productsObject;
	}


	public String getProductDescription() {
		return productDescription;
	}


	public void setProductDescription(String productDescription) {
		this.productDescription = productDescription;
	}


	public String getProductImage() {
		return productImage;
	}


	public void setProductImage(String productImage) {
		this.productImage = productImage;
	}

	
}
