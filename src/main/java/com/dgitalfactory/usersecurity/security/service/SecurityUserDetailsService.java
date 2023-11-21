package com.dgitalfactory.usersecurity.security.service;

import com.dgitalfactory.usersecurity.security.entity.User;
import com.dgitalfactory.usersecurity.exception.ResourceNotFoundException;
import com.dgitalfactory.usersecurity.security.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class SecurityUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var optUser = this.userRepository.findByUsername(username)
                .orElseThrow(()-> new ResourceNotFoundException("Email not found","email/username", username));

        return new org.springframework.security.core.userdetails.User(
                optUser.getUsername(),optUser.getPassword(),this.getAuthorities(optUser));
    }

    //Crear lista de roles de tipo Authority
    private Collection<? extends SimpleGrantedAuthority> getAuthorities(User user) {
        return user.getRoles().stream().map(
                role -> new SimpleGrantedAuthority(role.getName().toString())).toList();
    }
}
