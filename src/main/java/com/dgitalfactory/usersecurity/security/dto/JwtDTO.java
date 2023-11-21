package com.dgitalfactory.usersecurity.security.dto;

import lombok.*;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtDTO {

	private String token;
	private final String type = "Bearer";
	private String userName;
	private Collection<? extends GrantedAuthority> roles;
}
