package com.dgitalfactory.usersecurity.emailpassword.controller;

import com.dgitalfactory.usersecurity.DTO.MessageDTO;
import com.dgitalfactory.usersecurity.emailpassword.dto.ChangePasswordDTO;
import com.dgitalfactory.usersecurity.emailpassword.dto.EmailValuesDTO;
import com.dgitalfactory.usersecurity.emailpassword.service.EmailServide;
import com.dgitalfactory.usersecurity.service.UtilService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@RequestMapping("/api/email")
//@CrossOrigin
public class EmailController {

    @Autowired
    EmailServide emailServide;
    @Autowired
    UtilService utilSVC;
    @Value("${front.url.login}")
    private String FRONT_URL_LOGIN;

    @GetMapping("/activate-account/{token}")
    public RedirectView activateAccount(@PathVariable String token){
        this.emailServide.activateAccount(token);
        return this.utilSVC.redirectURL(FRONT_URL_LOGIN);
    }

    @PostMapping("/recovery")
    public ResponseEntity<MessageDTO> sendEmailTemplate(@RequestBody @Valid EmailValuesDTO emailValuesDTO){
        this.emailServide.senEmailRecoveryPassword(emailValuesDTO.getMailTo());
        return ResponseEntity.ok(
                MessageDTO.builder().code(HttpStatus.OK.toString()).message("Correo con template enviado con éxito").build()
        );
    }

    @PostMapping("/change-pass")
    public ResponseEntity<?> change(@RequestBody @Valid ChangePasswordDTO passwordDTO, BindingResult bindingResult){
        this.emailServide.changePassword(passwordDTO, bindingResult);
        return ResponseEntity.ok(
                MessageDTO.builder().code(HttpStatus.OK.toString()).message("Password Change").build()
        );
    }
}
