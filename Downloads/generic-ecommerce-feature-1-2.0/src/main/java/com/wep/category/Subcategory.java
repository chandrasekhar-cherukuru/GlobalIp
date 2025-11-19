package com.wep.category;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
@Entity
@Table(name="SUBCATEGORY")
public class Subcategory {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="SUB_CATEGORY_ID")
    private Long subCategoryId;
    
    @Column(name="SUB_CATEGORY_NAME")
    private String subCategoryName;
    
    @Column(name="SUB_CATEGORY_IMAGE")
    private String subCategoryNameImage;
    
    @ManyToOne
    @JoinColumn(name = "CATEGORY_ID")
    @JsonBackReference 
    private Category category;

	public Long getSubCategoryId() {
		return subCategoryId;
	}

	public void setSubCategoryId(Long subCategoryId) {
		this.subCategoryId = subCategoryId;
	}

	public String getSubCategoryName() {
		return subCategoryName;
	}

	public void setSubCategoryName(String subCategoryName) {
		this.subCategoryName = subCategoryName;
	}

	public String getSubCategoryNameImage() {
		return subCategoryNameImage;
	}

	public void setSubCategoryNameImage(String subCategoryNameImage) {
		this.subCategoryNameImage = subCategoryNameImage;
	}

	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}

}
