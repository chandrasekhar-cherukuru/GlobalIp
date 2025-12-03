package com.chakri.fundly.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserPrincipal implements UserDetails {

    private Users user;

    public UserPrincipal(Users user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // You can customize this based on user roles in the future
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    // ✅ Getter to access the wrapped Users entity
    public Users getUser() {
        return user;
    }

    // ✅ Helper methods for easier access to user properties
    public String getEmail() {
        return user.getEmail();
    }

    public AuthProvider getAuthProvider() {
        return user.getAuthProvider();
    }

    public String getProviderId() {
        return user.getProviderId();
    }

    public String getName() {
        return user.getName();
    }
}
