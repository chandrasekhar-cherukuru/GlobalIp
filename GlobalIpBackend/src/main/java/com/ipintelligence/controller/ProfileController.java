package com.ipintelligence.controller;

import com.ipintelligence.dto.ProfileRequest;
import com.ipintelligence.dto.ProfileResponse;
import com.ipintelligence.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    private final AuthService authService;

    public ProfileController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        return ResponseEntity.ok(authService.getProfile(email));
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> updateProfile(
            @Valid @RequestBody ProfileRequest request,
            Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        return ResponseEntity.ok(authService.updateProfile(email, request));
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @RequestBody ProfileRequest request,
            Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        authService.changePassword(email, request.getNewPassword());
        return ResponseEntity.ok("Password changed successfully");
    }
}
