package com.wep.productphotos;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
@Table(name="gprodphotos")
public class ProductPhotos {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="PHOTO_CODE")
	Long photoId;
	
	@Column(name="COMPCODE")
	Long compCode;
	
	@Column(name="PRD_CODE")
	String productId;
	
	@Column(name="PHOTO_NAME")
	String photoName;
	
	@Column(name="PHOTO_NAME_2")
	String photoName2;
	
	@Column(name="PHOTO_NAME_3")
	String photoName3;
	
	@Column(name="PHOTO_NAME_4")
	String photoName4;
	
	@Column(name="PHOTO_NAME_5")
	String photoName5;
	
	@Column(name="PHOTO_NAME_6")
	String photoName6;
	
	@Column(name="PHOTO_NAME_7")
	String photoName7;
	
	@Column(name="PHOTO_NAME_8")
	String photoName8;
	
	@Column(name="PHOTO_NAME_9")
	String photoName9;
	
	@Column(name="PHOTO_NAME_10")
	String photoName10;
	
	@Transient
	String productPhotoName;
	

	public Long getPhotoId() {
		return photoId;
	}

	public void setPhotoId(Long photoId) {
		this.photoId = photoId;
	}

	public Long getCompCode() {
		return compCode;
	}

	public void setCompCode(Long compCode) {
		this.compCode = compCode;
	}

	public String getProductId() {
		return productId;
	}

	public void setProductId(String productId) {
		this.productId = productId;
	}

	
	
	
	
	
	public String getPhotoName() {
		return photoName;
	}

	public void setPhotoName(String photoName) {
		this.photoName = photoName;
	}

	public String getPhotoName2() {
		return photoName2;
	}

	public void setPhotoName2(String photoName2) {
		this.photoName2 = photoName2;
	}

	public String getPhotoName3() {
		return photoName3;
	}

	public void setPhotoName3(String photoName3) {
		this.photoName3 = photoName3;
	}

	public String getPhotoName4() {
		return photoName4;
	}

	public void setPhotoName4(String photoName4) {
		this.photoName4 = photoName4;
	}

	public String getPhotoName5() {
		return photoName5;
	}

	public void setPhotoName5(String photoName5) {
		this.photoName5 = photoName5;
	}

	public String getPhotoName6() {
		return photoName6;
	}

	public void setPhotoName6(String photoName6) {
		this.photoName6 = photoName6;
	}

	public String getPhotoName7() {
		return photoName7;
	}

	public void setPhotoName7(String photoName7) {
		this.photoName7 = photoName7;
	}

	public String getPhotoName8() {
		return photoName8;
	}

	public void setPhotoName8(String photoName8) {
		this.photoName8 = photoName8;
	}

	public String getPhotoName9() {
		return photoName9;
	}

	public void setPhotoName9(String photoName9) {
		this.photoName9 = photoName9;
	}

	public String getPhotoName10() {
		return photoName10;
	}

	public void setPhotoName10(String photoName10) {
		this.photoName10 = photoName10;
	}


	public String getProductPhotoName() {
		return productPhotoName;
	}

	public void setProductPhotoName(String productPhotoName) {
		this.productPhotoName = productPhotoName;
	}


	@ManyToOne
	@JoinColumn(name = "PRD_CODE", insertable = false, updatable = false)
	@JsonBackReference
	private Products products;


	public Products getProducts() {
		return products;
	}

	public void setProducts(Products products) {
		this.products = products;
	}
	
	
}
