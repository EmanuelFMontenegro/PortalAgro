package com.dgitalfactory.usersecurity.emailpassword.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

@NoArgsConstructor
@Getter
@Setter
@ToString
public class EmailValuesDTO {

    private String mailFrom;
    @NotEmpty
    @Email
    private String mailTo;
    private String subject;
    private String userName;
    private String token;
}
