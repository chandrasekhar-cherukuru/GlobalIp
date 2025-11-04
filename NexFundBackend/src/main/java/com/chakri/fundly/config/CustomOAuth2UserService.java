package com.chakri.fundly.service;

import com.chakri.fundly.model.AuthProvider;
import com.chakri.fundly.model.Users;
import com.chakri.fundly.repo.UserRepo;
import com.chakri.fundly.security.CustomOAuth2User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String providerId = oauth2User.getAttribute("sub");

        if (email == null) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        Users user = userRepo.findByEmail(email);

        if (user == null) {
            // Create new user for first-time OAuth2 login
            user = new Users();
            user.setEmail(email);
            user.setName(name != null ? name : email);
            user.setUsername(email); // Use email as username
            user.setPassword(passwordEncoder.encode("oauth2_user_" + System.currentTimeMillis())); // Unique dummy password
            user.setAuthProvider(AuthProvider.GOOGLE);
            user.setProviderId(providerId);

            user = userRepo.save(user);
            System.out.println("✅ Created new OAuth2 user: " + email);
        } else {
            // Update existing user
            user.setName(name != null ? name : user.getName());
            user.setAuthProvider(AuthProvider.GOOGLE);
            user.setProviderId(providerId);
            user = userRepo.save(user);
            System.out.println("✅ Updated existing OAuth2 user: " + email);
        }

        return new CustomOAuth2User(user, oauth2User.getAttributes());
    }
}
