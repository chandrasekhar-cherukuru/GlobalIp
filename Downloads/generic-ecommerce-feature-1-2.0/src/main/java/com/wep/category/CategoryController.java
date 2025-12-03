package com.wep.category;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.wep.configs.S3Service;

import org.springframework.util.StringUtils;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/category")
public class CategoryController {

	private final CategoryApplicationService categoryService;

	@Autowired
	private S3Service s3Service;

    public CategoryController(CategoryApplicationService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/all-unhide")
    public ResponseEntity<List<Category>> getAllhiddenOrders() {
        List<Category> orders = categoryService.getHiddenCategories(false);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/all-hide")
    public ResponseEntity<List<Category>> getAllunhiddenOrders() {
        List<Category> orders = categoryService.getHiddenCategories(true);
        return ResponseEntity.ok(orders);
    }
    
    @PostMapping("/addCategory")
    public ResponseEntity<String> addNewCategory(@RequestParam String categoryName, @RequestParam MultipartFile categoryPhoto) {
        if (categoryName == null || categoryPhoto == null || categoryPhoto.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Input invalid");
        }

        String status = categoryService.addNewCategory(categoryName);
        if (status.contains("exists")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(status);
        }

        if (status.equals("Category added successfully")) {
            Category category = categoryService.getCategoryByName(categoryName);
            if (category == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving category");
            }
            
            try {
                String originalFilename = StringUtils.cleanPath(categoryPhoto.getOriginalFilename());
                String newFilename = category.getCategoryId() + "_" + originalFilename.substring(originalFilename.length() - 5);
                String s3Url = "https://divinedepot.s3.amazonaws.com/category/" + newFilename;
                s3Service.uploadFile("category/" + newFilename, categoryPhoto);

                category.setCategoryImage(s3Url);
                categoryService.saveCategory(category);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading image");
            }

            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Category added successfully with image.");
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error occurred");
    }
    
    @PostMapping("/deleteCategory")
    public ResponseEntity<String> deleteCategory(@RequestParam Long categoryId) {
    	String status="";
        if(null!=categoryId){
        	status=categoryService.deleteCategory(categoryId);
        }
        if(null!=status) {
        	return ResponseEntity.status(HttpStatus.ACCEPTED).body(status);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Input invalid");
    }
    
    @PostMapping("/hide")
    public ResponseEntity<String> hideCategory(@RequestParam Long categoryId) {
        boolean result = categoryService.updateCategoryVisibility(categoryId, true);
        if (result) {
            return ResponseEntity.ok("Category hidden successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Category not found.");
        }
    }

    @PostMapping("/unhide")
    public ResponseEntity<String> unhideCategory(@RequestParam Long categoryId) {
        boolean result = categoryService.updateCategoryVisibility(categoryId, false);
        if (result) {
            return ResponseEntity.ok("Category unhidden successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Category not found.");
        }
    }
    
    
    @PutMapping("/updateCategory")
    public ResponseEntity<String> updateCategory(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String categoryName,
            @RequestParam(required = false) MultipartFile categoryPhoto) {

        if (categoryId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Category ID is required.");
        }

        String status = categoryService.updateCategory(categoryId, categoryName, categoryPhoto);
        if (status.equals("Category updated successfully.")) {
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(status);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(status);
    }
}
