package com.dgitalfactory.usersecurity.security.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
