package com.ipintelligence.config;

import com.ipintelligence.model.User;
import com.ipintelligence.repo.UserRepository;
import com.ipintelligence.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.oauth2.authorized-redirect-uri}")
    private String redirectUri;

    public OAuth2AuthenticationSuccessHandler(JwtTokenProvider jwtTokenProvider,
                                              UserRepository userRepository,
                                              PasswordEncoder passwordEncoder) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        String email = null;
        String name = null;

        Object principal = authentication.getPrincipal();

        if (principal instanceof OidcUser oidcUser) {
            email = oidcUser.getEmail();
            name = oidcUser.getFullName();
        } else if (principal instanceof OAuth2User oauth2User) {
            email = oauth2User.getAttribute("email");
            name = oauth2User.getAttribute("name");
        }

        if (email == null) {
            throw new IOException("Unable to extract email from OAuth2 authentication");
        }

        // Find or create user
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = new User();
            user.setEmail(email);

            // Use display name if present, otherwise email prefix
            String username = (name != null && !name.isBlank())
                    ? name
                    : email.split("@")[0];

            user.setUsername(username);
            user.setPassword(passwordEncoder.encode("oauth2_" + System.currentTimeMillis()));
            user.setRole("USER");
            userRepository.save(user);
        }

        // Generate JWT using your existing provider
        String jwtToken = jwtTokenProvider.generateToken(user.getEmail(), user.getRole());

        // Redirect to frontend with JWT
        String targetUrl = redirectUri + "?token=" +
                URLEncoder.encode(jwtToken, StandardCharsets.UTF_8);

        response.sendRedirect(targetUrl);
    }
}
