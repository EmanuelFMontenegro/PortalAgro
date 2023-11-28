package com.dgitalfactory.usersecurity.security.configuration;

import com.dgitalfactory.usersecurity.security.service.SecurityUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.AbstractUserDetailsAuthenticationProvider;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class CustomAuthenticationProvider extends AbstractUserDetailsAuthenticationProvider {

    @Autowired
    private SecurityUserDetailsService userDetailsSerice;

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void additionalAuthenticationChecks(UserDetails userDetails, UsernamePasswordAuthenticationToken authentication) throws AuthenticationException {
        // Lógica para verificar la contraseña
        String password = authentication.getCredentials().toString();

        if (!this.passwordEncoder().matches(password, userDetails.getPassword())) {
            // La contraseña no coincide, maneja la lógica de bloqueo aquí
            // Incrementar el contador de intentos fallidos o bloquear la cuenta si excede un límite
            throw new BadCredentialsException("Credenciales inválidas");
        }
    }

    @Override
    protected UserDetails retrieveUser(String username, UsernamePasswordAuthenticationToken authentication) throws AuthenticationException {
        return this.userDetailsSerice.loadUserByUsername(username);
    }
}
