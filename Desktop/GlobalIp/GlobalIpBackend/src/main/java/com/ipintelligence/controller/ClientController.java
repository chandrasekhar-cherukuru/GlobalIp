package com.ipintelligence.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/client")
@PreAuthorize("hasRole('CLIENT')")
public class ClientController {

    @GetMapping
    public ResponseEntity<String> getClientData() {
        return ResponseEntity.ok("✅ CLIENT access granted! Welcome client.");
    }
}
