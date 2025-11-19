package com.wep.homepage.controller;

import com.wep.homepage.model.CarouselImage;
import com.wep.homepage.service.CarouselService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(maxAge = 3600)
@RequestMapping("/homepage/carousel")
public class CarouselController {

    @Autowired
    private CarouselService carouselService;

    @GetMapping("/get-images")
    public ResponseEntity<List<CarouselImage>> getAllCarouselImages() {
        List<CarouselImage> images = carouselService.getAllCarouselImages();
        return ResponseEntity.ok(images);
    }

    @PostMapping("/upload-images")
    public ResponseEntity<CarouselImage> uploadCarouselImage(
            @RequestParam("file") MultipartFile file) {
        try {
            CarouselImage uploadedImage = carouselService.uploadCarouselImage(file);
            return ResponseEntity.ok(uploadedImage);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/update-image/{id}")
    public ResponseEntity<CarouselImage> updateImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        try {
            CarouselImage updatedImage = carouselService.updateImage(id, file);
            return ResponseEntity.ok(updatedImage);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/delete-images/{id}")
    public ResponseEntity<Void> deleteCarouselImage(@PathVariable Long id) {
        carouselService.deleteCarouselImage(id);
        return ResponseEntity.noContent().build();
    }
}



