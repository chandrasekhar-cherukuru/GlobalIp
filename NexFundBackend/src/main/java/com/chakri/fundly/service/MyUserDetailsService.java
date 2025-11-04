package com.chakri.fundly.service;

import com.chakri.fundly.model.Users;
import com.chakri.fundly.model.UserPrincipal;
import com.chakri.fundly.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class MyUserDetailsService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(MyUserDetailsService.class);

    @Autowired
    private UserRepo repo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        logger.debug("Attempting to load user by username: {}", username);

        // Find user by username
        Users user = repo.findByUsername(username);

        if (user == null) {
            logger.warn("User not found with username: {}", username);
            throw new UsernameNotFoundException("User not found with username: " + username);
        }

        logger.debug("User found: {} with authProvider: {}", username, user.getAuthProvider());

        // Return UserPrincipal wrapping the Users entity
        return new UserPrincipal(user);
    }
}
