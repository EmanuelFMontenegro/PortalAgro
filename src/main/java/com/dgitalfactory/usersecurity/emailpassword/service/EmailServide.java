package com.dgitalfactory.usersecurity.emailpassword.service;



import com.dgitalfactory.usersecurity.emailpassword.dto.AccountActivateDTO;
import com.dgitalfactory.usersecurity.emailpassword.dto.ChangePasswordDTO;
import com.dgitalfactory.usersecurity.emailpassword.dto.EmailValuesDTO;
import com.dgitalfactory.usersecurity.security.entity.User;
import com.dgitalfactory.usersecurity.exception.GlobalAppException;
import com.dgitalfactory.usersecurity.security.service.JwtTokenService;
import com.dgitalfactory.usersecurity.security.service.UserService;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.HashMap;
import java.util.Map;

@Service
@Transactional
public class EmailServide {

    private static final Logger log = LoggerFactory.getLogger(EmailServide.class);

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Autowired
    private UserService userSVC;

    @Value("${server.url}")
    private String URL_SERVER;

    @Value("${server.port}")
    private String PORT_SERVER;

    @Value("${email.urlrecoverpass}")
    private String URL_EMAI_RECOVER_PASS;

    @Value("${spring.mail.username}")
    private String EMAIL_FROM;
    @Value("${email.subject}")
    private String EMAIL_SUBJECT;

    @Value("${email.tokenpassexpiration}")
    private int EMAIL_RECOVERY_EXPIRATION_IN_MS;

    @Value("${email.urlactiveaccount}")
    private String URL_ACTIVATE_ACCOUNT;

    @Autowired
    private JwtTokenService jwtTokenService;

    @Autowired
    private UtilsCommons utilService;

    public void senEmailActivateAccount(User us){
        String templateEmail = "email-activate-account-template";
        this.sendEmailTemplateActivateAccount(us,templateEmail);
    }

    public void senEmailRecoveryPassword(String username){
        User us = this.userSVC.findUser(username);
        if(!us.isAccount_Active()){
            throw new GlobalAppException(HttpStatus.UNAUTHORIZED,"El usuario debe validar su email","diccionario codigo");
        }
        String templateEmail = "email-recovery-pass-template";
        String token= this.jwtTokenService.generatedToken(username, EMAIL_RECOVERY_EXPIRATION_IN_MS);
        this.sendEmailTemplate(us.getUsername(),token,templateEmail);
    }

    /**
     * Password reset request
     *
     */
    public void sendEmailTemplate(String username, String token, String emailTemplate){
        EmailValuesDTO emailValuesDTO = new EmailValuesDTO();
        User us = this.userSVC.findUser(username);
        emailValuesDTO.setMailFrom(EMAIL_FROM);
        emailValuesDTO.setSubject(EMAIL_SUBJECT);
        //Cambiar por nombre de la persona
        emailValuesDTO.setUserName(us.getUsername());
        emailValuesDTO.setMailTo(us.getUsername());

        MimeMessage message = javaMailSender.createMimeMessage();
        try{
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            Context context = new Context();
            Map<String, Object> model = new HashMap<>();
            model.put("userName",emailValuesDTO.getUserName());

            //Generamos un token
            emailValuesDTO.setToken(token);

            model.put("url", URL_EMAI_RECOVER_PASS + emailValuesDTO.getToken());
            context.setVariables(model);
            String htmlText = templateEngine.process(emailTemplate, context);

            helper.setFrom(emailValuesDTO.getMailFrom());
            helper.setTo(emailValuesDTO.getMailTo());
            helper.setSubject(emailValuesDTO.getSubject());
            helper.setText(htmlText,true);

            us.setTokenPassword(emailValuesDTO.getToken());
            this.userSVC.saveUser(us);
            javaMailSender.send(message);
        }catch (MessagingException ex){
            log.error("Send email error", ex.getMessage());
            throw new GlobalAppException(HttpStatus.BAD_REQUEST, "Error al enviar el email", "code..");
        }
    }

    /**
     * Change user password
     *
     * @param passwordDTO: type @{{@link ChangePasswordDTO}}
     * @param bindingResult type @{{@link BindingResult}}
     */
    public void changePassword(@Valid ChangePasswordDTO passwordDTO, BindingResult bindingResult){
        try{
            this.jwtTokenService.isTokenExpired(passwordDTO.getToken());
        }catch (Exception ex){
            throw new GlobalAppException(HttpStatus.UNAUTHORIZED, "La solicitud a expirado...","code...");
        }
        if(bindingResult.hasErrors())
            throw  new GlobalAppException(HttpStatus.BAD_REQUEST, "Verificar Campos", "code..");
        if(!passwordDTO.getPassword().equals(passwordDTO.getConfirmPassword()))
            throw  new GlobalAppException(HttpStatus.BAD_REQUEST, "Las contraseñas no coinciden", "code..");

        if(this.utilService.validPassword(passwordDTO.getPassword()))
            throw  new GlobalAppException(HttpStatus.BAD_REQUEST, "El password debe tener longitud minima de 8 carcateres, al menos una minuscula y una mayuscula", "code..");

        User us = this.userSVC.getUserByTokenPassword(passwordDTO.getToken());
        us.setTokenPassword(null);
        this.userSVC.setPassword(us, passwordDTO.getPassword());
    }

    public void sendEmailTemplateActivateAccount(User us, String emailTemplate){
        EmailValuesDTO emailValuesDTO = new EmailValuesDTO();
        emailValuesDTO.setMailFrom(EMAIL_FROM);
        emailValuesDTO.setSubject(EMAIL_SUBJECT);
        //Cambiar por nombre de la persona
        emailValuesDTO.setUserName(us.getUsername());
        emailValuesDTO.setMailTo(us.getUsername());

        MimeMessage message = javaMailSender.createMimeMessage();
        try{
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            Context context = new Context();
            Map<String, Object> model = new HashMap<>();
            model.put("userName",emailValuesDTO.getUserName());

            //Generamos un token
            emailValuesDTO.setToken(us.getTokenPassword());

            model.put("url", URL_ACTIVATE_ACCOUNT + emailValuesDTO.getToken());
            context.setVariables(model);
            String htmlText = templateEngine.process(emailTemplate, context);

            helper.setFrom(emailValuesDTO.getMailFrom());
            helper.setTo(emailValuesDTO.getMailTo());
            helper.setSubject(emailValuesDTO.getSubject());
            helper.setText(htmlText,true);

            javaMailSender.send(message);
        }catch (MessagingException ex){
            log.error("Send email error", ex.getMessage());
            throw new GlobalAppException(HttpStatus.BAD_REQUEST, "Error al enviar el email", "code..");
        }
    }

    public void activateAccount(String token){
        try{
            this.jwtTokenService.isTokenExpired(token);
        }catch (Exception ex){
            throw new GlobalAppException(HttpStatus.UNAUTHORIZED, "La solicitud a expirado...","code...");
        }

        User us = this.userSVC.getUserByTokenPassword(token);
        us.setTokenPassword(null);
        us.setAccount_Active(true);
        this.userSVC.saveUser(us);
    }
}
