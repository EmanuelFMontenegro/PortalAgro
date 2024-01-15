package com.dgitalfactory.usersecurity.security.dto;

import com.dgitalfactory.usersecurity.security.entity.Role;
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
public class UserMinResponseDTO {
	private Long id;
	private String username;
	private boolean account_active;
	private Set<Role> roles;

	public UserMinResponseDTO(Long id, String username, boolean account_active, Set<Role> roles) {
		this.id = id;
		this.username = username;
		this.account_active = account_active;
		this.roles = roles;
	}
}
