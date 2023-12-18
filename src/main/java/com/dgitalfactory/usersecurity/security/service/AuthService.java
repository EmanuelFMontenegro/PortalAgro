package com.dgitalfactory.usersecurity.security.service;

import com.dgitalfactory.usersecurity.DTO.Person.PersonResponseDTO;
import com.dgitalfactory.usersecurity.email.service.EmailServide;
import com.dgitalfactory.usersecurity.exception.GlobalAppException;
import com.dgitalfactory.usersecurity.security.dto.JwtDTO;
import com.dgitalfactory.usersecurity.security.dto.LoginDTO;
import com.dgitalfactory.usersecurity.security.dto.UserResponseDTO;
import com.dgitalfactory.usersecurity.security.entity.CustomeUserDetails;
import com.dgitalfactory.usersecurity.security.entity.User;
import com.dgitalfactory.usersecurity.service.PersonService;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserService userSVC;
    @Autowired
    private PersonService personSVC;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtTokenService jwtSVC;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private EmailServide emailServide;

    @Autowired
    private UtilsCommons utilsCommons;
    @Value("${email.tokenaccountexpiration}")
    private int EMAIL_ACCOUNT_EXPIRATION_IN_MS;

    public JwtDTO login(@NotNull LoginDTO loginDTO) {
        Authentication authentication = this.authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDTO.getUsername(), loginDTO.getPassword()));

        CustomeUserDetails userDetails = (CustomeUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        if (user != null) {
            if(user.getFailedAttempts()>0){
                this.userSVC.resetFailedAttempts(user.getUsername());
            }
        }
        if (!user.isAccount_active() && user.getTokenPassword()!=null) {
            throw new GlobalAppException(HttpStatus.UNAUTHORIZED, 4001,utilsCommons.getMessage("field.name.user"));
        } else if (!user.isAccount_active()){
                throw new GlobalAppException(HttpStatus.UNAUTHORIZED, 4030,utilsCommons.getMessage("field.name.user"));
        }


        /**
         * 		Se le pasa el estado de la autenticación con los valores recibidos de la
         * 		petición, el SecurityContextHolder decide con esos datos
         * 		si esta o no autorizado
         * 		Si no esta autorizado lo pasa al AuthenticationEntryPoint
         */
        SecurityContextHolder.getContext().setAuthentication(authentication);
        final String jwt = this.jwtSVC.generatedToken(authentication, user.getId());

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
     * @param userResponseDTO: UserDTO (username, password)
     * @return JwtAuthResponseDTO (String tokenAccess, String tokenType)
     */
    @Transactional()
    public void register(@NotNull UserResponseDTO userResponseDTO) {
        if (this.userSVC.existsUser(userResponseDTO.getUsername())) {
            throw new GlobalAppException(HttpStatus.BAD_REQUEST, 4002,utilsCommons.getMessage("field.name.user"));
        }
        String token = this.jwtSVC.generatedToken(userResponseDTO.getUsername(), EMAIL_ACCOUNT_EXPIRATION_IN_MS);
        User us = this.userSVC.saveUser(userResponseDTO, token);
        this.personSVC.addPerson(us.getId(),new PersonResponseDTO().builder().build());
        this.emailServide.senEmailActivateAccount(us);
    }


}
