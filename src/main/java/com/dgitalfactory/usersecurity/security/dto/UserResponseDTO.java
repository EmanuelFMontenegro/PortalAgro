package com.dgitalfactory.usersecurity.security.dto;

import com.dgitalfactory.usersecurity.security.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
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
public class UserResponseDTO {

	@NotEmpty
	@Email
	private String username;
	private boolean account_active;
	private boolean account_block;
	private LocalDateTime locke_time;
	private Set<Role> roles;
}
