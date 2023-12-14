package com.dgitalfactory.usersecurity.email.controller;

import com.dgitalfactory.usersecurity.DTO.MessageDTO;
import com.dgitalfactory.usersecurity.email.dto.ChangePasswordDTO;
import com.dgitalfactory.usersecurity.email.dto.EmailValuesDTO;
import com.dgitalfactory.usersecurity.email.service.EmailServide;
import com.dgitalfactory.usersecurity.service.UtilService;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@RestController
@RequestMapping("/api/email")
//@CrossOrigin
@Tag(name = "Email Send", description = "Email Services")
public class EmailController {

    @Autowired
    EmailServide emailServide;
    @Autowired
    UtilService utilSVC;

    @Autowired
    private UtilsCommons utilsCommons;

    @Value("${front.url.activate}")
    private String FRONT_URL;

    @GetMapping("/activate-account/{token}")
    public RedirectView activateAccount(@PathVariable String token){
        this.emailServide.activateAccount(token);
        return this.utilSVC.redirectURL(FRONT_URL);
    }

    @PostMapping("/recovery")
    public ResponseEntity<MessageDTO> sendEmailTemplate(@RequestBody @Valid EmailValuesDTO emailValuesDTO){
        this.emailServide.senEmailRecoveryPassword(emailValuesDTO.getMailTo());
        return ResponseEntity.ok(
                MessageDTO.builder().code(2004).message(utilsCommons.getErrorMessage(2004)).build()
        );
    }

    @PostMapping("/change-pass")
    public ResponseEntity<?> change(@RequestBody @Valid ChangePasswordDTO passwordDTO, BindingResult bindingResult){
        this.emailServide.changePassword(passwordDTO, bindingResult);
        return ResponseEntity.ok(
                MessageDTO.builder().code(2005).message(utilsCommons.getErrorMessage(2005)).build()
        );
    }
}
