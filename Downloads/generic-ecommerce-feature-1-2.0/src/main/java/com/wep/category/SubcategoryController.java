package com.wep.category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subcategories")
public class SubcategoryController {

    @Autowired
    private SubcategoryService subcategoryService;

    // Create a new subcategory
    @PostMapping
    public ResponseEntity<Subcategory> createSubcategory(@RequestBody SubcategoryDTO subcategoryDTO) {
        Subcategory createdSubcategory = subcategoryService.createSubcategory(subcategoryDTO);
        return ResponseEntity.ok(createdSubcategory);
    }

    // Get all subcategories
    @GetMapping
    public ResponseEntity<List<Subcategory>> getAllSubcategories() {
        List<Subcategory> subcategories = subcategoryService.getAllSubcategories();
        return ResponseEntity.ok(subcategories);
    }

    // Get a single subcategory by ID
    @GetMapping("/{id}")
    public ResponseEntity<Subcategory> getSubcategoryById(@PathVariable Long id) {
        return subcategoryService.getSubcategoryById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update a subcategory
    @PutMapping("/{id}")
    public ResponseEntity<Subcategory> updateSubcategory(@PathVariable Long id, @RequestBody SubcategoryDTO subcategoryDTO) {
        try {
            Subcategory updatedSubcategory = subcategoryService.updateSubcategory(id, subcategoryDTO);
            return ResponseEntity.ok(updatedSubcategory);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a subcategory
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubcategory(@PathVariable Long id) {
        subcategoryService.deleteSubcategory(id);
        return ResponseEntity.ok().build();
    }
}
