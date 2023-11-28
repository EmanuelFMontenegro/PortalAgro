package com.dgitalfactory.usersecurity.security.dto;

import com.dgitalfactory.usersecurity.security.entity.Role;
import jakarta.persistence.Column;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Validated
public class UserDTO {

	@NotEmpty
	@Email
	private String username;

	@NotEmpty
	@Size(min=8, max = 30)
	private String password;
	private boolean account_active;
	private boolean account_block;
	private int failed_attemps;
	private LocalDateTime locke_time;
	private Set<Role> roles;
}
