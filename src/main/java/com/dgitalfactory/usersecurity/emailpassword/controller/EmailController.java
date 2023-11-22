package com.dgitalfactory.usersecurity.emailpassword.controller;

import com.dgitalfactory.usersecurity.emailpassword.dto.ChangePasswordDTO;
import com.dgitalfactory.usersecurity.emailpassword.dto.EmailValuesDTO;
import com.dgitalfactory.usersecurity.emailpassword.service.EmailServide;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
//@CrossOrigin
@Tag(name = "Email Send", description = "Email password recovery and change pass, email activate account")
public class EmailController {

    @Autowired
    EmailServide emailServide;

    @PostMapping("/recovery")
    public ResponseEntity<?> sendEmailTemplate(@RequestBody @Valid EmailValuesDTO emailValuesDTO){
        emailServide.sendEmailTemplate(emailValuesDTO);
        return new ResponseEntity("Correo con template enviado con éxito", HttpStatus.OK);
    }

    @PostMapping("/change-pass")
    public ResponseEntity<?> change(@RequestBody @Valid ChangePasswordDTO passwordDTO, BindingResult bindingResult){
        this.emailServide.changePassword(passwordDTO, bindingResult);
        return new ResponseEntity<>("Password Change", HttpStatus.OK);
    }
}
