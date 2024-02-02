package com.dgitalfactory.usersecurity.email.service;

import com.dgitalfactory.usersecurity.email.dto.ChangePasswordDTO;
import com.dgitalfactory.usersecurity.email.dto.EmailValuesDTO;
import com.dgitalfactory.usersecurity.security.entity.User;
import com.dgitalfactory.usersecurity.exception.GlobalAppException;
import com.dgitalfactory.usersecurity.security.service.JwtTokenService;
import com.dgitalfactory.usersecurity.security.service.UserService;
import com.dgitalfactory.usersecurity.utils.AppConstants;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.exceptions.TemplateProcessingException;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Service
public class EmailServide {

    private static final Logger log = LoggerFactory.getLogger(EmailServide.class);

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Autowired
    private UserService userSVC;

    @Autowired
    private UtilsCommons utilsCommons;

    @Value("${front.url.recoverpass}")
    private String FRONT_RECOVER_PASS;

    @Value("${spring.mail.username}")
    private String EMAIL_FROM;

    @Value("${email.token.pass.expiration}")
    private int EMAIL_RECOVERY_EXPIRATION_IN_MS;

    @Value("${email.url.active.account}")
    private String URL_ACTIVATE_ACCOUNT;

    @Value("${agro.email.support}")
    private String EMAIL_AGRO_SUPPORT;
//    @Value("${commons.publc.img.portal}")
//    private String URL_IMG_PORTAL;

//    @Value("${commons.publc.img.silicon}")
//    private String URL_IMG_SILICON;

    private ClassPathResource portal2 = new ClassPathResource("static/public/img/portal-del-productor-2.png");
    private ClassPathResource silicon = new ClassPathResource("static/public/img/SiliconM.png");

    @Autowired
    private JwtTokenService jwtTokenService;

    public void senEmailActivateAccount(User us) {
        String templateEmail = "email-activate-account-template";
        this.sendEmailTemplateActivateAccount(us, templateEmail);
    }

    public void senEmailRecoveryPassword(String username) {
        User us = this.userSVC.findUser(username);
        if (!us.isAccount_active()) {
            throw new GlobalAppException(HttpStatus.UNAUTHORIZED, 4001, "field.name.email");
        }
        String templateEmail = "email-recovery-pass-template";
        String token = this.jwtTokenService.generatedToken(username, EMAIL_RECOVERY_EXPIRATION_IN_MS);
        this.sendEmailTemplate(us.getUsername(), token, templateEmail);
    }

    /**
     * Password reset request
     */
    public void sendEmailTemplate(String username, String token, String emailTemplate) {
        EmailValuesDTO emailValuesDTO = new EmailValuesDTO();
        User us = this.userSVC.findUser(username);
        emailValuesDTO.setMailFrom(EMAIL_FROM);
        emailValuesDTO.setSubject(utilsCommons.getMessage("email.send.recovery.pass.subject"));
        //Cambiar por nombre de la persona
        emailValuesDTO.setUserName(us.getUsername());
        emailValuesDTO.setMailTo(us.getUsername());

        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name());
            Context context = new Context();
            Map<String, Object> model = new HashMap<>();
            model.put("userName", emailValuesDTO.getUserName());

            //Generamos un token
            emailValuesDTO.setToken(token);
            model.put("url", FRONT_RECOVER_PASS + emailValuesDTO.getToken());

            model.put("emailRecoveryTitle", utilsCommons.getMessage("email.send.recovery.pass.title"));

            model.put("emailRecoveryGreeting", utilsCommons.getMessage("email.send.recovery.pass.greeting"));
            model.put("emailRecoveryMsn", utilsCommons.getMessage("email.send.recovery.pass.greeting.msn"));
            model.put("emailRecoveryInstruction", utilsCommons.getMessage("email.send.recovery.pass.greeting.instruction"));

            model.put("emailRecoveryBtnRecovery", utilsCommons.getMessage("email.send.recovery.pass.btn.activate"));

            model.put("emailRecoveryImportant", utilsCommons.getMessage("email.send.recovery.pass.important"));
            model.put("emailRecoveryNoRequest", utilsCommons.getMessage("email.send.recovery.pass.noRequest"));
            model.put("emailRecoveryContact", utilsCommons.getMessage("email.send.recovery.pass.contact"));
            model.put("emailSupport", EMAIL_AGRO_SUPPORT);

            model.put("emailRecoveryGreetingEnd", utilsCommons.getMessage("email.send.recovery.pass.greeting.end"));
            model.put("emailRecoverySignature", utilsCommons.getMessage("email.send.recovery.pass.signature"));

            context.setVariables(model);
            String htmlText = templateEngine.process(emailTemplate, context);

            helper.setFrom(emailValuesDTO.getMailFrom());
            helper.setTo(emailValuesDTO.getMailTo());
            helper.setSubject(emailValuesDTO.getSubject());
            helper.setText(htmlText, true);

            helper.addInline("portal2", portal2);
            helper.addInline("silicon", silicon);

            us.setTokenPassword(emailValuesDTO.getToken());
            this.userSVC.saveUser(us);
            javaMailSender.send(message);
        } catch (MessagingException ex) {
            log.error("Send email error", ex.getMessage());
            throw new GlobalAppException(HttpStatus.BAD_REQUEST, 4003, ex.getMessage());
        }
    }

    /**
     * Change user password
     *
     * @param passwordDTO:  type @{{@link ChangePasswordDTO}}
     * @param bindingResult type @{{@link BindingResult}}
     */
    public void changePassword(@Valid ChangePasswordDTO passwordDTO, BindingResult bindingResult) {
        try {
            this.jwtTokenService.isTokenExpired(passwordDTO.getToken());
        } catch (Exception ex) {
            throw new GlobalAppException(HttpStatus.UNAUTHORIZED, 4004, ex.getMessage());
        }
        if (bindingResult.hasErrors())
            throw new GlobalAppException(HttpStatus.BAD_REQUEST, 4012, "field.name.email");
        if (!passwordDTO.getPassword().equals(passwordDTO.getConfirmPassword()))
            throw new GlobalAppException(HttpStatus.NOT_FOUND, 4018, "field.name.email");

        if (!UtilsCommons.validPassword(passwordDTO.getPassword())) {
            throw new GlobalAppException(HttpStatus.NOT_FOUND, 4012,
                    utilsCommons.getFormatMessage(
                           4034,
                            String.valueOf(AppConstants.PASSWORD_MIN),
                            String.valueOf(AppConstants.PASSWORD_MAX)
                    )
            );
        }

        User us = this.userSVC.getUserByTokenPassword(passwordDTO.getToken());
        us.setTokenPassword(null);
        this.userSVC.setPassword(us, passwordDTO.getPassword());
    }

    public void sendEmailTemplateActivateAccount(User us, String emailTemplate) {
        EmailValuesDTO emailValuesDTO = new EmailValuesDTO();
        emailValuesDTO.setMailFrom(EMAIL_FROM);
        emailValuesDTO.setSubject(utilsCommons.getMessage("email.send.activate.account.subject"));
        //Cambiar por nombre de la persona
        emailValuesDTO.setUserName(us.getUsername());
        emailValuesDTO.setMailTo(us.getUsername());

        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name());

            Context context = new Context();
            Map<String, Object> model = new HashMap<>();
            model.put("userName", emailValuesDTO.getUserName());

            //Generamos un token
            emailValuesDTO.setToken(us.getTokenPassword());

            model.put("url", URL_ACTIVATE_ACCOUNT + emailValuesDTO.getToken());
            model.put("emailActivateTitle", utilsCommons.getMessage("email.send.activate.account.title"));

            model.put("emailGreeting", utilsCommons.getMessage("email.send.activate.account.greeting"));
            model.put("emailGreetingMsn", utilsCommons.getMessage("email.send.activate.account.greeting.msn"));
            model.put("emailGreetingInstruction", utilsCommons.getMessage("email.send.activate.account.greeting.instruction"));

            model.put("emailGreetingBtnActivate", utilsCommons.getMessage("email.send.activate.account.btn.activate"));

            model.put("emailGreetingImportant", utilsCommons.getMessage("email.send.activate.account.important"));
            model.put("emailGreetingNoRequest", utilsCommons.getMessage("email.send.activate.account.noRequest"));
            model.put("emailGreetingContact", utilsCommons.getMessage("email.send.activate.account.contact"));
            model.put("emailSupport", EMAIL_AGRO_SUPPORT);

            model.put("emailGreetingThanks", utilsCommons.getMessage("email.send.activate.account.thanks"));
            model.put("emailGreetingGreetingEnd", utilsCommons.getMessage("email.send.activate.account.greeting.end"));
            model.put("emailGreetingSignature", utilsCommons.getMessage("email.send.activate.account.signature"));

//            model.put("rutaImagenPortal", URL_IMG_PORTAL);
//            model.put("rutaImagenSilicon", URL_IMG_SILICON);

            context.setVariables(model);
            String htmlText = templateEngine.process(emailTemplate, context);

            helper.setFrom(emailValuesDTO.getMailFrom());
            helper.setTo(emailValuesDTO.getMailTo());
            helper.setSubject(emailValuesDTO.getSubject());
            helper.setText(htmlText, true);
            helper.addInline("portal2", portal2);
            helper.addInline("silicon", silicon);

            javaMailSender.send(message);
        } catch (MessagingException ex) {
            log.error("Send email error", ex.getMessage());
            throw new GlobalAppException(HttpStatus.INTERNAL_SERVER_ERROR, 4003, ex.getMessage());
        } catch (TemplateProcessingException ex) {
            log.error("Create templates with thymeleaf error", ex.getMessage());
            throw new GlobalAppException(HttpStatus.INTERNAL_SERVER_ERROR, 4032, ex.getMessage());
        }
    }

    //    @Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = Exception.class)
    public void activateAccount(String token) {
        try {
            if (this.jwtTokenService.isTokenExpired(token)) {
                throw new GlobalAppException(HttpStatus.UNAUTHORIZED, 4004, "field.name.email");
            }
        } catch (Exception ex) {
            throw new GlobalAppException(HttpStatus.UNAUTHORIZED, 4004, ex.getMessage());
        }

        User us = this.userSVC.getUserByTokenPassword(token);
        us.setTokenPassword(null);
        us.setAccount_active(true);
        this.userSVC.saveUser(us);
    }
}
