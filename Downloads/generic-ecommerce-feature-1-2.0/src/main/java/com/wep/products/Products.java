package com.wep.products;

import java.sql.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.wep.cart.Cart;
import com.wep.productphotos.ProductPhotos;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name="GPRODMAST")
public class Products {
	@Id
	@Column(name = "PRD_CODE", nullable = false)
    private String productId;

    @Column(name = "PRD_NAME", nullable = true)
    private String productName;

    @Column(name = "PRD_UNIT", nullable = true)
    private String productQuantity;

    @Column(name = "SALRATE", nullable = true)
    private Double productPrice;

    @Column(name = "PURRATE", nullable = true)
    private Double purRate;

    @Column(name = "MRP", nullable = true)
    private Double mrp;

    @Transient
    @Column(name = "PERCENT", nullable = true, columnDefinition = "FLOAT")
    private  float productPercent;


	@Column(name = "VATRATE", nullable = true)
    private Double vatRate;

    @Column(name = "STATUS", nullable = true)
    private int status;

    @Column(name = "REQSTATUS", nullable = true)
    private int reqStatus;

    @Column(name = "CATEGORY", nullable = true)
    private String category;

    @Column(name = "BRAND", nullable = true)
    private String brand;

    @Column(name = "BOX", nullable = true)
    private Double box;

    @Column(name = "WEIGHT", nullable = true)
    private Double weight;

    @Column(name = "HSN_SC", nullable = true)
    private String hsnSc;

    @Column(name = "CREATEDBY", nullable = true)
    private String createdBy;

    @Column(name = "CREATEDTIME", nullable = true)
    private Date createdTime;

    @Column(name = "MODIFIEDBY", nullable = true)
    private String modifiedBy;

    @Column(name = "MODIFIEDTIME", nullable = true)
    private Date modifiedTime;
    
    @Column(name = "image", nullable = true)
    private Integer image;

    @Column(name = "inactive", nullable = true)
    private boolean isProductHidden;

    @Column(name = "PRDDESC", nullable = true)
    private String prdDesc;

    @Column(name = "minstk", nullable = true)
    private Double minStk;

    @Column(name = "PRD_PURITY", nullable = true)
    private String prdPurity;
    
    @Column(name = "CATEGORY_ID", nullable = true)
    private String categoryId;
    
    @Column(name = "SUB_CATEGORY_ID", nullable = true)
    private String subcategoryId;
    
    @Column(name = "GST_NO", nullable = true)
    private String gstNo;

    @OneToMany(mappedBy = "products")
    @JsonManagedReference
    private List<ProductPhotos> productPhotos;
   
    @JsonIgnore
    @OneToMany(mappedBy = "productsObject")
    @JsonManagedReference
    private List<Cart> cartObject;
    
	public List<ProductPhotos> getProductPhotos() {
		return productPhotos;
	}

	public void setProductPhotos(List<ProductPhotos> productPhotos) {
		this.productPhotos = productPhotos;
	}

	public float getProductPercent() {
		return productPercent;
	}

	public void setProductPercent(float productPercent) {
		this.productPercent = productPercent;
	}


	public String getProductId() {
		return productId;
	}

	public void setProductId(String productId) {
		this.productId = productId;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public String getProductQuantity() {
		return productQuantity;
	}

	public void setProductQuantity(String productQuantity) {
		this.productQuantity = productQuantity;
	}

	public Double getProductPrice() {
		return productPrice;
	}

	public void setProductPrice(Double productPrice) {
		this.productPrice = productPrice;
	}

	public Double getPurRate() {
		return purRate;
	}

	public void setPurRate(Double purRate) {
		this.purRate = purRate;
	}

	public Double getMrp() {
		return mrp;
	}

	public void setMrp(Double mrp) {
		this.mrp = mrp;
	}

	public float getPercent() {
		return productPercent;
	}

	public void setPercent(float productPercent) {
		this.productPercent = productPercent;
	}

	public Double getVatRate() {
		return vatRate;
	}

	public void setVatRate(Double vatRate) {
		this.vatRate = vatRate;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public int getReqStatus() {
		return reqStatus;
	}

	public void setReqStatus(int reqStatus) {
		this.reqStatus = reqStatus;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public Double getBox() {
		return box;
	}

	public void setBox(Double box) {
		this.box = box;
	}

	public Double getWeight() {
		return weight;
	}

	public void setWeight(Double weight) {
		this.weight = weight;
	}

	public String getHsnSc() {
		return hsnSc;
	}

	public void setHsnSc(String hsnSc) {
		this.hsnSc = hsnSc;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public Date getCreatedTime() {
		return createdTime;
	}

	public void setCreatedTime(Date createdTime) {
		this.createdTime = createdTime;
	}

	public String getModifiedBy() {
		return modifiedBy;
	}

	public void setModifiedBy(String modifiedBy) {
		this.modifiedBy = modifiedBy;
	}

	public Date getModifiedTime() {
		return modifiedTime;
	}

	public void setModifiedTime(Date modifiedTime) {
		this.modifiedTime = modifiedTime;
	}

	public Integer getImage() {
		return image;
	}

	public void setImage(Integer image) {
		this.image = image;
	}

	public boolean isProductHidden() {
		return isProductHidden;
	}

	public void setProductHidden(boolean isProductHidden) {
		this.isProductHidden = isProductHidden;
	}

	public String getPrdDesc() {
		return prdDesc;
	}

	public void setPrdDesc(String prdDesc) {
		this.prdDesc = prdDesc;
	}

	public Double getMinStk() {
		return minStk;
	}

	public void setMinStk(Double minStk) {
		this.minStk = minStk;
	}

	public String getPrdPurity() {
		return prdPurity;
	}

	public void setPrdPurity(String prdPurity) {
		this.prdPurity = prdPurity;
	}

	public String getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(String categoryId) {
		this.categoryId = categoryId;
	}

	public String getSubcategoryId() {
		return subcategoryId;
	}

	public void setSubcategoryId(String subcategoryId) {
		this.subcategoryId = subcategoryId;
	}

	public String getGstNo() {
		return gstNo;
	}

	public void setGstNo(String gstNo) {
		this.gstNo = gstNo;
	}

	public List<Cart> getCartObject() {
		return cartObject;
	}

	public void setCartObject(List<Cart> cartObject) {
		this.cartObject = cartObject;
	}
	@Override
	public String toString() {
		return "Products [productId=" + productId + ", productName=" + productName + ", productQuantity="
				+ productQuantity + ", productPrice=" + productPrice + ", purRate=" + purRate + ", mrp=" + mrp
				+ ", productPercent=" + productPercent + ", vatRate=" + vatRate + ", status=" + status + ", reqStatus="
				+ reqStatus + ", category=" + category + ", brand=" + brand + ", box=" + box + ", weight=" + weight
				+ ", hsnSc=" + hsnSc + ", createdBy=" + createdBy + ", createdTime=" + createdTime + ", modifiedBy="
				+ modifiedBy + ", modifiedTime=" + modifiedTime + ", image=" + image + ", isProductHidden="
				+ isProductHidden + ", prdDesc=" + prdDesc + ", minStk=" + minStk + ", prdPurity=" + prdPurity
				+ ", categoryId=" + categoryId + ", subcategoryId=" + subcategoryId + ", gstNo=" + gstNo
				+ ", productPhotos=" + productPhotos + ", cartObject=" + cartObject + "]";
	}
}
