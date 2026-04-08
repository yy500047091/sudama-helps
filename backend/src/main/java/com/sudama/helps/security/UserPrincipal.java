package com.sudama.helps.security;

import com.sudama.helps.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;

/**
 * Custom UserDetails implementation for Spring Security
 */
public class UserPrincipal implements UserDetails {
    private Long id;
    private String email;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;

    // Constructors
    public UserPrincipal() {}

    public UserPrincipal(Long id, String email, String password, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
    }

    public static UserPrincipal create(User user) {
        return new UserPrincipal(
                user.getId(),
                user.getEmail(),
                user.getPasswordHash(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }

    // Builder-like static methods to help with creation if needed
    public static UserPrincipalBuilder builder() {
        return new UserPrincipalBuilder();
    }

    // Getters
    public Long getId() { return id; }
    public String getEmail() { return email; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
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

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setAuthorities(Collection<? extends GrantedAuthority> authorities) { this.authorities = authorities; }

    // Manual Builder
    public static class UserPrincipalBuilder {
        private Long id;
        private String email;
        private String password;
        private Collection<? extends GrantedAuthority> authorities;

        public UserPrincipalBuilder id(Long id) { this.id = id; return this; }
        public UserPrincipalBuilder email(String email) { this.email = email; return this; }
        public UserPrincipalBuilder password(String password) { this.password = password; return this; }
        public UserPrincipalBuilder authorities(Collection<? extends GrantedAuthority> authorities) { this.authorities = authorities; return this; }

        public UserPrincipal build() {
            return new UserPrincipal(id, email, password, authorities);
        }
    }
}
