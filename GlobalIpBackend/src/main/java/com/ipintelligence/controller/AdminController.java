package com.ipintelligence.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @GetMapping//checks
    //returns to frontend
    public ResponseEntity<String> getAdminData() {
        return ResponseEntity.ok("✅ ADMIN access granted! Full system control.");
    }
}
