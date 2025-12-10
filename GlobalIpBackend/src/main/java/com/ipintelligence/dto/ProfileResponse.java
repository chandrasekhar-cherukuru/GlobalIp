package com.ipintelligence.dto;

public class ProfileResponse {
    private Integer id;  // Changed from Long to Integer
    private String username;
    private String email;
    private String role;

    public ProfileResponse(Integer id, String username, String email, String role) {  // Changed Long to Integer
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
    }

    // Update getter too
    public Integer getId() { return id; }  // Changed from Long to Integer
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
}
