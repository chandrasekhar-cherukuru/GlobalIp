package com.wep.customProd;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "custom_products")
public class customProd {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "barcode", nullable = false)
    private String productId;

    @Column(name = "product_name")
    private String productName;

    @Column(name = "purchase_no")
    private Long purchaseNo;

    @Column(name = "purchase_date")
    private String purchaseDate;

    @Column(name = "product_description")
    private String productDescription;

    @Column(name = "product_description2")
    private String productDescription2;

    @Column(name = "product_rate")
    private Double productRate;

    @Column(name = "product_mrp")
    private Double productMRP;

    @Column(name = "product_quantity")
    private int productQuantity;

    @Column(name = "product_hsn")
    private String productHSN;

    @Column(name = "color")
    private String productColor;

    @Column(name = "brand")
    private String productBrand;

    @Column(name = "product_gst")
    private Double productGST;

    @Column(name = "product_design_no")
    private String productDesignNo;

    @Column(name = "type")
    private String productType;

    @Column(name = "style")
    private String productStyle;

    @Column(name = "sleeves")
    private String productSleeves;

    @Column(name = "size")
    private String productSize;

    @Column(name = "stock")
    private String productStock;

    @Column(name = "product_category")
    private String productCategory;

    @Column(name = "product_subcategory")
    private String productSubcategory;

    @Column(name = "product_created_date_time")
    private String productCreatedDateAndTime;

    @Column(name = "product_updated_date_time")
    private LocalDateTime productUpdatedDateAndTime;

    @Column(name = "prod_img1")
    private String prodImg1;

    @Column(name = "prod_img2")
    private String prodImg2;

    @Column(name = "prod_img3")
    private String prodImg3;

    @Column(name = "prod_img4")
    private String prodImg4;

    @Column(name = "prod_img5")
    private String prodImg5;

    @Column(name = "prod_img6")
    private String prodImg6;

    @Column(name = "product_ratings")
    private Double productRatings;

    @Column(name = "offers")
    private Boolean offerProduct;

    @Column(name = "lightning_Deal")
    private Boolean lightningDealProduct;

    @Column(name = "deal_of_the_day")
    private Boolean dealofdayProduct;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "is_hidden")
    private Boolean isHidden;

    @Column(name = "new_arrival")
    private Boolean newArrival;

    @Column(name = "sacred_offerings")
    private Boolean sacredOfferings;

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Long getPurchaseNo() { return purchaseNo; }
    public void setPurchaseNo(Long purchaseNo) { this.purchaseNo = purchaseNo; }

    public String getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(String purchaseDate) { this.purchaseDate = purchaseDate; }

    public String getProductDescription() { return productDescription; }
    public void setProductDescription(String productDescription) { this.productDescription = productDescription; }

    public String getProductDescription2() { return productDescription2; }
    public void setProductDescription2(String productDescription2) { this.productDescription2 = productDescription2; }

    public Double getProductRate() { return productRate; }
    public void setProductRate(Double productRate) { this.productRate = productRate; }

    public Double getProductMRP() { return productMRP; }
    public void setProductMRP(Double productMRP) { this.productMRP = productMRP; }

    public int getProductQuantity() { return productQuantity; }
    public void setProductQuantity(int productQuantity) { this.productQuantity = productQuantity; }

    public String getProductHSN() { return productHSN; }
    public void setProductHSN(String productHSN) { this.productHSN = productHSN; }

    public String getProductColor() { return productColor; }
    public void setProductColor(String productColor) { this.productColor = productColor; }

    public String getProductBrand() { return productBrand; }
    public void setProductBrand(String productBrand) { this.productBrand = productBrand; }

    public Double getProductGST() { return productGST; }
    public void setProductGST(Double productGST) { this.productGST = productGST; }

    public String getProductDesignNo() { return productDesignNo; }
    public void setProductDesignNo(String productDesignNo) { this.productDesignNo = productDesignNo; }

    public String getProductType() { return productType; }
    public void setProductType(String productType) { this.productType = productType; }

    public String getProductStyle() { return productStyle; }
    public void setProductStyle(String productStyle) { this.productStyle = productStyle; }

    public String getProductSleeves() { return productSleeves; }
    public void setProductSleeves(String productSleeves) { this.productSleeves = productSleeves; }

    public String getProductSize() { return productSize; }
    public void setProductSize(String productSize) { this.productSize = productSize; }

    public String getProductStock() { return productStock; }
    public void setProductStock(String productStock) { this.productStock = productStock; }

    public String getProductCategory() { return productCategory; }
    public void setProductCategory(String productCategory) { this.productCategory = productCategory; }

    public String getProductSubcategory() { return productSubcategory; }
    public void setProductSubcategory(String productSubcategory) { this.productSubcategory = productSubcategory; }

    public String getProductCreatedDateAndTime() { return productCreatedDateAndTime; }
    public void setProductCreatedDateAndTime(String productCreatedDateAndTime) { this.productCreatedDateAndTime = productCreatedDateAndTime; }

    public LocalDateTime getProductUpdatedDateAndTime() { return productUpdatedDateAndTime; }
    public void setProductUpdatedDateAndTime(LocalDateTime productUpdatedDateAndTime) { this.productUpdatedDateAndTime = productUpdatedDateAndTime; }

    public String getProdImg1() { return prodImg1; }
    public void setProdImg1(String prodImg1) { this.prodImg1 = prodImg1; }
    public String getProdImg2() { return prodImg2; }
    public void setProdImg2(String prodImg2) { this.prodImg2 = prodImg2; }
    public String getProdImg3() { return prodImg3; }
    public void setProdImg3(String prodImg3) { this.prodImg3 = prodImg3; }
    public String getProdImg4() { return prodImg4; }
    public void setProdImg4(String prodImg4) { this.prodImg4 = prodImg4; }
    public String getProdImg5() { return prodImg5; }
    public void setProdImg5(String prodImg5) { this.prodImg5 = prodImg5; }
    public String getProdImg6() { return prodImg6; }
    public void setProdImg6(String prodImg6) { this.prodImg6 = prodImg6; }

    public Double getProductRatings() { return productRatings; }
    public void setProductRatings(Double productRatings) { this.productRatings = productRatings; }

    public Boolean getOfferProduct() { return offerProduct; }
    public void setOfferProduct(Boolean offerProduct) { this.offerProduct = offerProduct; }
    public Boolean getLightningDealProduct() { return lightningDealProduct; }
    public void setLightningDealProduct(Boolean lightningDealProduct) { this.lightningDealProduct = lightningDealProduct; }
    public Boolean getDealofdayProduct() { return dealofdayProduct; }
    public void setDealofdayProduct(Boolean dealofdayProduct) { this.dealofdayProduct = dealofdayProduct; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public Boolean getIsHidden() { return isHidden; }
    public void setIsHidden(Boolean isHidden) { this.isHidden = isHidden; }

    public Boolean getNewArrival() { return newArrival; }
    public void setNewArrival(Boolean newArrival) { this.newArrival = newArrival; }

    public Boolean getSacredOfferings() { return sacredOfferings; }
    public void setSacredOfferings(Boolean sacredOfferings) { this.sacredOfferings = sacredOfferings; }
}



