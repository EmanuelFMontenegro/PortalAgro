package com.dgitalfactory.usersecurity.security.dto;

import com.dgitalfactory.usersecurity.security.entity.Role;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.validation.annotation.Validated;

import java.util.Set;
/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Getter
@Setter
@NoArgsConstructor
@Validated
public class UserResponseDTO {

	@NotEmpty
	@Email
	private String username;

	@NotEmpty
	@Size(min=8, max = 30)
	private String password;
	private Set<Role> roles;
}
