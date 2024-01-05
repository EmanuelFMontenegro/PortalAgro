package com.dgitalfactory.usersecurity.security.dto;

import com.dgitalfactory.usersecurity.utils.AppConstants;
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
	@Size(min= AppConstants.PASSWORD_MIN, max = AppConstants.PASSWORD_MAX)
	private String password;
}
