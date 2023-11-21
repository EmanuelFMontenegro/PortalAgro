package com.dgitalfactory.usersecurity.security.controller;

import com.dgitalfactory.usersecurity.security.dto.JwtDTO;
import com.dgitalfactory.usersecurity.security.dto.LoginDTO;
import com.dgitalfactory.usersecurity.security.dto.UserDTO;
import com.dgitalfactory.usersecurity.service.AuthService;
import com.dgitalfactory.usersecurity.service.UserService;
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
	private AuthenticationManager authenticationManager;
	
//	@Autowired
//	private JwtTokenProvider jwtTokenProvider;


	@PostMapping("/login")
	/**
	 *
	 * @param logionDTO: parametros que recibirémos del login
	 * @return ResponseEntity<JwtAuthResponseDTO>:
	 * <ul>
	 *     <li>JwtAuthResponseDTO: es una clase que tiene los elementos token y el tipo de encabezado
	 *     del HEADER "AUTHORIZATION"</li>
	 * </ul>
	 */
	public ResponseEntity<JwtDTO> authenticateUser(@Valid @RequestBody LoginDTO loginDTO, BindingResult bindingResult) {
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
	public ResponseEntity<?> registerUser(@Valid @RequestBody UserDTO registerDTO) {
		JwtDTO authDTO = this.authSVC.register(registerDTO);
//		return new ResponseEntity<>(authDTO, HttpStatus.CREATED);
		return new ResponseEntity<>("Registered user", HttpStatus.CREATED);

	}
}
