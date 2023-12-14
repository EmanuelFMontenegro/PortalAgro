package com.dgitalfactory.usersecurity.security.controller;

import com.dgitalfactory.usersecurity.DTO.MessageDTO;
import com.dgitalfactory.usersecurity.security.dto.JwtDTO;
import com.dgitalfactory.usersecurity.security.dto.LoginDTO;
import com.dgitalfactory.usersecurity.security.dto.UserResponseDTO;
import com.dgitalfactory.usersecurity.security.service.AuthService;
import com.dgitalfactory.usersecurity.security.service.JwtTokenService;
import com.dgitalfactory.usersecurity.security.service.UserService;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;
/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin
@Tag(name = "Authentication", description = "Authentication Services")
public class AuthConntroller {

	@Autowired
	private UserService userSVC;

	@Autowired
	private AuthService authSVC;

	@Autowired
	private JwtTokenService jwtSVC;
	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private UtilsCommons utilsCommons;

	/**
	 *
	 * @param @{@link LoginDTO}: parametros que recibirémos del login
	 * @return ResponseEntity<JwtAuthResponseDTO>:
	 * <ul>
	 *     <li>JwtAuthResponseDTO: es una clase que tiene los elementos token y el tipo de encabezado
	 *     del HEADER "AUTHORIZATION"</li>
	 * </ul>
	 */
	@PostMapping("/login")
	public ResponseEntity<JwtDTO> authenticateUser(@Valid @RequestBody LoginDTO loginDTO) {
		 return new ResponseEntity<>(this.authSVC.login(loginDTO), HttpStatus.OK);
	}

	/**
	 * Rester user and generate token
	 * By default your role is "visitor"
	 *
	 * @param registerDTO: UserDTO (username, password)
	 * @return JwtAuthResponseDTO: String token
	 */
	@PostMapping("/register")
	public ResponseEntity<MessageDTO> registerUser(@Valid @RequestBody UserResponseDTO registerDTO) {
		this.authSVC.register(registerDTO);
		return ResponseEntity.ok(
				MessageDTO.builder()
						.code(2001)
						.message(utilsCommons.getErrorMessage(2001))
						.details(utilsCommons.getMessage("field.name.user"))
						.build()
		);
	}

	/**
	 *Refresh token
	 *
	 * @param jwtDTO: tipe @{@link JwtDTO}
	 * @return
	 * <ul>
	 *     <li>This ok: String JwtDTO</li>
	 *     <li>Error JWT parse: @{@link java.text.ParseException}</li>
	 * </ul>
	 */
	@PostMapping("/refresh")
	public ResponseEntity<JwtDTO> refreshToken(@Valid @RequestBody JwtDTO jwtDTO) {
		return new ResponseEntity(this.jwtSVC.getRefreshToken(jwtDTO), HttpStatus.OK);
	}
}
