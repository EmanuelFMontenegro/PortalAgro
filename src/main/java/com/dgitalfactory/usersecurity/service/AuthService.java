package com.dgitalfactory.usersecurity.service;

import com.dgitalfactory.usersecurity.exception.GlobalAppException;
import com.dgitalfactory.usersecurity.security.dto.JwtDTO;
import com.dgitalfactory.usersecurity.security.dto.LoginDTO;
import com.dgitalfactory.usersecurity.security.dto.UserDTO;
import com.dgitalfactory.usersecurity.security.entity.SecurityUser;
import com.dgitalfactory.usersecurity.security.entity.User;
import com.dgitalfactory.usersecurity.security.service.JwtTokenService;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserService userSVC;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtTokenService jwtSVC;
    @Autowired
    private AuthenticationManager authenticationManager;

    public JwtDTO login(@NotNull LoginDTO loginDTO) {
        User user = this.userSVC.findUser(loginDTO.getUsername());

        Authentication authentication = this.authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDTO.getUsername(), loginDTO.getPassword()));

        UserDetails us = (UserDetails) authentication.getPrincipal();

        /**
         * 		Se le pasa el estado de la autenticación con los valores recibidos de la
         * 		petición, el SecurityContextHolder decide con esos datos
         * 		si esta o no autorizado
         * 		Si no esta autorizado lo pasa al AuthenticationEntryPoint
         */
        SecurityContextHolder.getContext().setAuthentication(authentication);
        final String jwt = this.jwtSVC.generatedToken(authentication);

        //get Token del JwtTokenProvider
        return JwtDTO
                .builder()
                .token(jwt)
                .userName(us.getUsername())
                .roles(us.getAuthorities())
                .build();
    }

    /**
     * Rester user and generate token
     * By default your role is "visitor"
     *
     * @param userDTO: UserDTO (username, password)
     * @return JwtAuthResponseDTO (String tokenAccess, String tokenType)
     */
    public JwtDTO register(@NotNull UserDTO userDTO) {

        if (this.userSVC.existsUser(userDTO.getUsername())) {
            throw new GlobalAppException(HttpStatus.BAD_REQUEST, "User already exists.", "");
        }
        this.userSVC.saveUser(userDTO);

        Authentication authentication = this.authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userDTO.getUsername(), userDTO.getPassword()));

        return JwtDTO
                .builder()
                .token(this.jwtSVC.generatedToken(authentication))
                .build();
    }

}
