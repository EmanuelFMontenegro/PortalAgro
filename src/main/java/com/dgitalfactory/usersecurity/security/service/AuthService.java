package com.dgitalfactory.usersecurity.security.service;

import com.dgitalfactory.usersecurity.emailpassword.service.EmailServide;
import com.dgitalfactory.usersecurity.exception.GlobalAppException;
import com.dgitalfactory.usersecurity.security.dto.JwtDTO;
import com.dgitalfactory.usersecurity.security.dto.LoginDTO;
import com.dgitalfactory.usersecurity.security.dto.UserDTO;
import com.dgitalfactory.usersecurity.security.entity.User;
import jakarta.transaction.Transactional;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class AuthService {

    @Autowired
    private UserService userSVC;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtTokenService jwtSVC;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private EmailServide emailServide;


    @Value("${email.tokenaccountexpiration}")
    private int EMAIL_ACCOUNT_EXPIRATION_IN_MS;

    public JwtDTO login(@NotNull LoginDTO loginDTO) {
        User user = this.userSVC.findUser(loginDTO.getUsername());
        if(!user.isAccount_Active()){
            throw new GlobalAppException(HttpStatus.UNAUTHORIZED,"El usuario debe validar su email","diccionario codigo");
        }
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
                .build();
    }

    /**
     * Rester user and generate token
     * By default your role is "visitor"
     *
     * @param userDTO: UserDTO (username, password)
     * @return JwtAuthResponseDTO (String tokenAccess, String tokenType)
     */
    public void register(@NotNull UserDTO userDTO) {
        if (this.userSVC.existsUser(userDTO.getUsername())) {
            throw new GlobalAppException(HttpStatus.BAD_REQUEST, "User already exists.", "");
        }
        String token= this.jwtSVC.generatedToken(userDTO.getUsername(), EMAIL_ACCOUNT_EXPIRATION_IN_MS);
        User us = this.userSVC.saveUser(userDTO, token);
        this.emailServide.senEmailActivateAccount(us);
    }

}
