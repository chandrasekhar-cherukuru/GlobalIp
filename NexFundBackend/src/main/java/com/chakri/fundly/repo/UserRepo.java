package com.chakri.fundly.repo;

import com.chakri.fundly.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<Users, Integer> {

    // ✅ Method used by MyUserDetailsService
    Users findByUsername(String username);

    // ✅ Method used by OAuth2 service
    Users findByEmail(String email);

    // ✅ Optional: Method to find by provider ID (for OAuth2)
    Users findByProviderIdAndAuthProvider(String providerId, com.chakri.fundly.model.AuthProvider authProvider);
}
