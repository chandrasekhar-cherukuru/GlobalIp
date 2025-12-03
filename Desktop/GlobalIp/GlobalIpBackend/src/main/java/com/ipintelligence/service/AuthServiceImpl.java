package com.ipintelligence.service;

import com.ipintelligence.dto.AuthRequest;
import com.ipintelligence.dto.AuthResponse;
import com.ipintelligence.dto.RegisterRequest;
import com.ipintelligence.model.User;
import com.ipintelligence.repo.UserRepository;
import com.ipintelligence.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtTokenProvider jwt;

    public AuthServiceImpl(UserRepository users,
                           PasswordEncoder encoder,
                           AuthenticationManager authManager,
                           JwtTokenProvider jwt) {
        this.users = users;
        this.encoder = encoder;
        this.authManager = authManager;
        this.jwt = jwt;
    }

    @Override
    public AuthResponse register(RegisterRequest r) {
        if (users.existsByEmail(r.getEmail()) || users.existsByUsername(r.getUsername())) {
            throw new RuntimeException("User already exists");
        }

        User u = new User();
        u.setUsername(r.getUsername());
        u.setEmail(r.getEmail());
        u.setPassword(encoder.encode(r.getPassword()));

        String role = r.getRole();
        if (role == null || role.isBlank()) {
            role = "CLIENT";
        } else {
            role = role.toUpperCase();
            if (!role.equals("ADMIN") && !role.equals("ANALYST") && !role.equals("CLIENT")) {
                throw new RuntimeException("Invalid role: " + role);
            }
        }
        u.setRole(role);

        //saves into db
        users.save(u);

        String token = jwt.generateToken(u.getEmail(), u.getRole());

        return new AuthResponse(token, u.getId(), u.getUsername(), u.getEmail(), u.getRole());
    }

    @Override
    public AuthResponse login(AuthRequest r) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(r.getEmail(), r.getPassword())
        );

        User u = users.findByEmail(r.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        String token = jwt.generateToken(u.getEmail(), u.getRole());

        return new AuthResponse(token, u.getId(), u.getUsername(), u.getEmail(), u.getRole());
    }


}
