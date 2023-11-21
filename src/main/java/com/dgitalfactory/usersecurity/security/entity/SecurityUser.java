package com.dgitalfactory.usersecurity.security.entity;

import com.dgitalfactory.usersecurity.security.entity.Role;
import com.dgitalfactory.usersecurity.security.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;

@AllArgsConstructor
public class SecurityUser implements UserDetails {
    private final User user;

    @Override
    public String getUsername() {
        return this.user.getUsername();
    }

    @Override
    public String getPassword() {
        return this.user.getPassword();
    }


    /**
     * Mapea los roles de un set y de encontrar alguno los casteamos a GrantedAuthority,
     * que es el tipo de rol que maneja Spring Security
     * @param roles set de clases de tipo rol
     * @return List<GrantedAuthority>
     */
    private Collection<? extends GrantedAuthority> mapRoles(Set<Role> roles) {
        return roles.stream().map(
                role -> new SimpleGrantedAuthority(role.getName().toString())).toList();
    }

    @Override
    /**
     * Mapea los Authorities de un set y de encontrar alguno los casteamos a GrantedAuthority,
     * que es el tipo de rol que maneja Spring Security
     * @param roles set de clases de tipo rol
     * @return List<GrantedAuthority>
     */
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.mapRoles(this.user.getRoles());
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
}
