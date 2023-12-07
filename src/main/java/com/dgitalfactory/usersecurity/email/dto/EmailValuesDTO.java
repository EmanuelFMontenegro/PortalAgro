package com.dgitalfactory.usersecurity.email.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
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
