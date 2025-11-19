package com.wep.category;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.wep.configs.S3Service;


@Service
public class CategoryApplicationService {

	@Autowired
	private final CategoryRepository rep;
	@Autowired
	private S3Service s3Service;
	
	
	public CategoryApplicationService(CategoryRepository rep) {
		this.rep = rep;
	}

	public List<Category> getHiddenCategories(boolean isHidden) {
	    return rep.findAllByIsCategoryHidden(isHidden);
	}

	public String addNewCategory(String categoryName) {
    if (rep.existsByCategoryName(categoryName)) {
        return "Category already exists";
    }
    Category category = new Category();
    category.setCategoryName(categoryName);
    rep.save(category);
    return "Category added successfully";

	}
	 public Category getCategoryByName(String categoryName) {
	        return rep.findByCategoryName(categoryName);
	    }
	 public void saveCategory(Category category) {
	        rep.save(category);
	    }


	public String deleteCategory(Long categoryId) {
	    Optional<Category> categoryOptional = rep.findById(categoryId);
	    if (categoryOptional.isPresent()) {
	        rep.delete(categoryOptional.get());
	        return "Category deleted successfully.";
	    } else {
	        return "Category not found.";
	    }
	}
	public boolean updateCategoryVisibility(Long categoryId, boolean hide) {
	    Optional<Category> category = rep.findById(categoryId);
	    if (category.isPresent()) {
	        Category updatedCategory = category.get();
	        updatedCategory.setCategoryHidden(hide);
	        rep.save(updatedCategory);
	        return true;
	    }
	    return false;
	}


	public String updateCategory(Long categoryId, String updatedCategory, MultipartFile categoryPhoto) {
	    Optional<Category> categoryOptional = rep.findById(categoryId);
	    if (categoryOptional.isPresent()) {
	        Category existingCategory = categoryOptional.get();

	        if (updatedCategory != null) {
	            existingCategory.setCategoryName(updatedCategory);
	        }

	        if (categoryPhoto != null && categoryPhoto.getSize() < 5 * 1024 * 1024) { // Check if the photo size is less than 5MB
	            String originalFilename = StringUtils.cleanPath(categoryPhoto.getOriginalFilename());
	            String newFilename = categoryId + "_" + originalFilename.substring(originalFilename.length() - 5);
	            String s3Url = "https://divinedepot.s3.amazonaws.com/category/" + newFilename;
				s3Service.uploadFile("category/" + newFilename, categoryPhoto);
	            existingCategory.setCategoryImage(s3Url);
	        }

	        rep.save(existingCategory);
	        return "Category updated successfully.";
	    } else {
	        return "Category not found.";
	    }

	}
}
