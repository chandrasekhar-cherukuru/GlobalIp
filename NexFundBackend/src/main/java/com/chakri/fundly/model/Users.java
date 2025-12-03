package com.chakri.fundly.model;

import jakarta.persistence.*;
import com.chakri.fundly.model.AuthProvider; // ✅ Import your custom enum

@Entity
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true)
    private String username;

    @Column(unique = true)
    private String email;

    private String password; // Can be NULL for OAuth2 users

    // NEW: OAuth2 fields
    @Enumerated(EnumType.STRING)
    private AuthProvider authProvider = AuthProvider.LOCAL; // ✅ Now uses your enum

    private String providerId; // Google user ID

    private String name; // Full name from OAuth2

    // Default constructor
    public Users() {}

    // Existing constructor (for regular registration)
    public Users(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.authProvider = AuthProvider.LOCAL;
    }

    // NEW: OAuth2 constructor
    public Users(String email, String name, AuthProvider authProvider, String providerId) {
        this.email = email;
        this.name = name;
        this.username = name; // Use name as username for OAuth2 users
        this.authProvider = authProvider;
        this.providerId = providerId;
        this.password = null; // No password for OAuth2 users
    }

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public AuthProvider getAuthProvider() { return authProvider; }
    public void setAuthProvider(AuthProvider authProvider) { this.authProvider = authProvider; }

    public String getProviderId() { return providerId; }
    public void setProviderId(String providerId) { this.providerId = providerId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    @Override
    public String toString() {
        return "Users{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", authProvider=" + authProvider +
                '}';
    }
}
