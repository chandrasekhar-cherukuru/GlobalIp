package com.wep.category;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class SubcategoryService {

    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Transactional
    public Subcategory createSubcategory(SubcategoryDTO subcategoryDTO) {
        Subcategory subcategory = new Subcategory();
        subcategory.setSubCategoryName(subcategoryDTO.getName());
        subcategory.setSubCategoryNameImage(subcategoryDTO.getDescription());
        
        // Fetch the category using categoryId and set it
        Optional<Category> category = categoryRepository.findById(subcategoryDTO.getCategoryId());
        if (!category.isPresent()) {
            throw new RuntimeException("Category with ID " + subcategoryDTO.getCategoryId() + " not found");
        }
        subcategory.setCategory(category.get());
        
        return subcategoryRepository.save(subcategory);
    }

    // Read all subcategories
    public List<Subcategory> getAllSubcategories() {
        return subcategoryRepository.findAll();
    }

    // Read a single subcategory by ID
    public Optional<Subcategory> getSubcategoryById(Long id) {
        return subcategoryRepository.findById(id);
    }

    // Update a subcategory
    @Transactional
    public Subcategory updateSubcategory(Long id, SubcategoryDTO subcategoryDTO) {
        Optional<Subcategory> existingSubcategory = subcategoryRepository.findById(id);
        return existingSubcategory.map(subcategory -> {
            subcategory.setSubCategoryName(subcategoryDTO.getName());
            subcategory.setSubCategoryNameImage(subcategoryDTO.getDescription());
            
            return subcategoryRepository.save(subcategory);
        }).orElseThrow(() -> new RuntimeException("Subcategory not found"));
    }

    // Delete a subcategory
    public void deleteSubcategory(Long id) {
        subcategoryRepository.deleteById(id);
    }
}
