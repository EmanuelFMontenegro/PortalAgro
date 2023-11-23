package com.dgitalfactory.usersecurity.emailpassword.controller;

import com.dgitalfactory.usersecurity.DTO.MessageDTO;
import com.dgitalfactory.usersecurity.emailpassword.dto.AccountActivateDTO;
import com.dgitalfactory.usersecurity.emailpassword.dto.ChangePasswordDTO;
import com.dgitalfactory.usersecurity.emailpassword.dto.EmailValuesDTO;
import com.dgitalfactory.usersecurity.emailpassword.service.EmailServide;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
//@CrossOrigin
public class EmailController {

    @Autowired
    EmailServide emailServide;

    @GetMapping("/activate-account/{token}")
    public ResponseEntity<MessageDTO> activateAccount(@PathVariable String token){
        this.emailServide.activateAccount(token);
        return ResponseEntity.ok(
                MessageDTO.builder().code(HttpStatus.OK.toString()).message("Account Activated").build()
        );
    }

    @PostMapping("/recovery")
    public ResponseEntity<MessageDTO> sendEmailTemplate(@RequestBody @Valid EmailValuesDTO emailValuesDTO){
        emailServide.senEmailRecoveryPassword(emailValuesDTO.getMailTo());
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
