package com.dgitalfactory.usersecurity.security.controller;

import com.dgitalfactory.usersecurity.DTO.MessageDTO;
import com.dgitalfactory.usersecurity.security.dto.JwtDTO;
import com.dgitalfactory.usersecurity.security.dto.LoginDTO;
import com.dgitalfactory.usersecurity.security.dto.UserDTO;
import com.dgitalfactory.usersecurity.security.service.AuthService;
import com.dgitalfactory.usersecurity.security.service.JwtTokenService;
import com.dgitalfactory.usersecurity.security.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthConntroller {

	@Autowired
	private UserService userSVC;

	@Autowired
	private AuthService authSVC;

	@Autowired
	private JwtTokenService jwtSVC;
	@Autowired
	private AuthenticationManager authenticationManager;
	
//	@Autowired
//	private JwtTokenProvider jwtTokenProvider;


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
	public ResponseEntity<MessageDTO> registerUser(@Valid @RequestBody UserDTO registerDTO) {
		this.authSVC.register(registerDTO);
		return ResponseEntity.ok(
				MessageDTO.builder().code(HttpStatus.CREATED.toString()).message("Registered user").build()
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
		return new ResponseEntity<>(this.jwtSVC.getRefreshToken(jwtDTO), HttpStatus.OK);
	}
}
