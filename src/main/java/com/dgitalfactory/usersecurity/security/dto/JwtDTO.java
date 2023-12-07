package com.dgitalfactory.usersecurity.security.dto;

import lombok.*;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtDTO {

	private String token;
}
