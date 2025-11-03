package com.chakri.fundly.service;

import com.chakri.fundly.model.Users;
import com.chakri.fundly.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder; // Use PasswordEncoder interface
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private JWTService jwtService;

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private UserRepo repo;

    @Autowired
    private PasswordEncoder passwordEncoder; // Use PasswordEncoder interface

    public Users register(Users user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        repo.save(user);
        return user;
    }

    public String verify(Users user) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );

        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(user.getUsername());
        } else {
            return "Authentication failed";
        }
    }
}
