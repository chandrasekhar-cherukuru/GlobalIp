package com.wep.category;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "category")
public class Category {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "category_id")
	private Long categoryId;

	@Column(name = "category_name")
	private String categoryName;

	@Column(name = "category_image")
	private String categoryImage;

	// @JsonIgnore
	@OneToMany(mappedBy = "category")
	@JsonManagedReference
	private List<Subcategory> subcategoryList;

	@Column(name = "inactive", nullable = true)
	private boolean isCategoryHidden;

	public boolean isCategoryHidden() {
		return isCategoryHidden;
	}

	public void setCategoryHidden(boolean isCategoryHidden) {
		this.isCategoryHidden = isCategoryHidden;
	}

	public Long getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(Long categoryId) {
		this.categoryId = categoryId;
	}

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

	public String getCategoryImage() {
		return categoryImage;
	}

	public void setCategoryImage(String categoryImage) {
		this.categoryImage = categoryImage;
	}

	public List<Subcategory> getSubcategoryList() {
		return subcategoryList;
	}

	public void setSubcategoryList(List<Subcategory> subcategoryList) {
		this.subcategoryList = subcategoryList;
	}

}
