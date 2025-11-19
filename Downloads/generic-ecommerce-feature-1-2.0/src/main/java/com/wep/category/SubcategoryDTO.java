package com.wep.category;


public class SubcategoryDTO {

    private String name;
    private String description;
    private Long categoryId;

    // Constructors
    public SubcategoryDTO() {
    }

    public SubcategoryDTO(String name, String description) {
        this.name = name;
        this.description = description;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

	public Long getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(Long categoryId) {
		this.categoryId = categoryId;
	}
    

}