package com.dgitalfactory.usersecurity.emailpassword.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AccountActivateDTO {
    @NotBlank
    private String token;
}
