package com.dgitalfactory.usersecurity.security.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Getter
@Setter
@NoArgsConstructor
public class LoginDTO {

	@NotBlank
	@Email
	private String username;
	@NotBlank
	@Size(min=8, max = 30)
	private String password;
}
