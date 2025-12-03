package com.ipintelligence.service;

import com.ipintelligence.dto.AuthRequest;
import com.ipintelligence.dto.AuthResponse;
import com.ipintelligence.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(AuthRequest request);
}
