package com.chakri.fundly.config;

import com.chakri.fundly.service.JWTService;
import com.chakri.fundly.model.AuthProvider;
import com.chakri.fundly.model.Users;
import com.chakri.fundly.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private JWTService jwtService;  // Service for generating JWT tokens

    @Autowired
    private UserRepo userRepo;      // Repository to check/save users in DB

    @Autowired
    private PasswordEncoder passwordEncoder; // Encoder for setting default password

    @Value("${app.oauth2.authorizedRedirectUri}")
    private String redirectUri;     // Redirect URL (comes from application.yml or properties)

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        String email = null;
        String name = null;
        String providerId = null;

        // Extract user info depending on the provider type
        // Case 1: OIDC (like Google with OpenID Connect)
        Object principal = authentication.getPrincipal();

        if (principal instanceof OidcUser) {
            OidcUser oidcUser = (OidcUser) principal;
            email = oidcUser.getEmail();          // Get email from Google profile
            name = oidcUser.getFullName();        // Get full name
            providerId = oidcUser.getSubject();   // Unique ID from Google
        }
        // Case 2: Generic OAuth2User (like GitHub, Facebook, etc.)
        else if (principal instanceof OAuth2User) {
            OAuth2User oauth2User = (OAuth2User) principal;
            email = oauth2User.getAttribute("email");
            name = oauth2User.getAttribute("name");
            providerId = oauth2User.getAttribute("sub"); // "sub" = unique identifier in OAuth2
        }

        // If we cannot extract email → authentication is useless
        if (email == null) {
            throw new IOException("Unable to extract email from OAuth2 authentication");
        }

        // Step 1: Check if the user already exists in DB
        Users user = userRepo.findByEmail(email);

        // Step 2: If user does NOT exist, create a new one
        if (user == null) {
            user = new Users();
            user.setEmail(email);
            user.setName(name != null ? name : email); // Fallback: use email as name
            user.setUsername(email);                   // Use email as username
            user.setPassword(passwordEncoder.encode("oauth2_user_" + System.currentTimeMillis()));
            // Generate a dummy password (since user logs in via Google, not password)
            user.setAuthProvider(AuthProvider.GOOGLE); // Mark provider as GOOGLE
            user.setProviderId(providerId);            // Store provider unique ID
            userRepo.save(user);                       // Save new user to DB
        }

        // Step 3: Generate a JWT token for this user
        String jwtToken = jwtService.generateToken(user.getUsername());

        // Step 4: Redirect the user to frontend (React) with JWT token in URL query param
        String targetUrl = redirectUri + "?token=" + URLEncoder.encode(jwtToken, StandardCharsets.UTF_8);

        // Perform actual redirect
        response.sendRedirect(targetUrl);
    }
}
