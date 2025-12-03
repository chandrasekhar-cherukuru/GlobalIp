package com.wep.homepage.controller;

import com.wep.homepage.model.MidBannerImage;
import com.wep.homepage.service.MidBannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(maxAge = 3600)
@RequestMapping("/homepage/mid-banners")
public class MidBannerController {

    @Autowired
    private MidBannerService service;

    @GetMapping("/get-images")
    public ResponseEntity<List<MidBannerImage>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping("/upload-images")
    public ResponseEntity<MidBannerImage> upload(@RequestParam("file") MultipartFile file) {
        try {
            return ResponseEntity.ok(service.upload(file));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/update-image/{id}")
    public ResponseEntity<MidBannerImage> update(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            return ResponseEntity.ok(service.update(id, file));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/delete-images/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}


