package com.dgitalfactory.usersecurity.security.service;

import com.dgitalfactory.usersecurity.exception.GlobalAppException;
import com.dgitalfactory.usersecurity.security.dto.JwtDTO;
import com.dgitalfactory.usersecurity.security.jwt.JWTAuthenticationFilter;
import com.dgitalfactory.usersecurity.service.EncoderDecorderBase64Service;
import com.nimbusds.jwt.JWT;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.JWTParser;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.text.ParseException;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Component
public class JwtTokenService {

	private static final Logger log = LoggerFactory.getLogger(JwtTokenService.class);

	@Value("${app.jwt-secret}")
	private String SIGNING_KEY;

	@Value("${app.jwt-expiration-milliseconds}")
	private int JWT_EXPIRATION_IN_MS;

	@Value("${jwt.authorities.key}")
	public String AUTHORITIES_KEY;

	@Autowired
	private EncoderDecorderBase64Service encodeDecodeSVC;


	private String getSecretBase64() {
		return this.encodeDecodeSVC.encoder(this.SIGNING_KEY);
	}

	private SecretKey getSecretKey() {
		return Keys.hmacShaKeyFor(this.getSecretBase64().getBytes());
	}


	/**
	 * Se genera token de seguridad con un usuuario dado, y un conjunto de elementos extra
	 * para el payload
	 *
	 * @param authentication: usuario autenticado o registrado
	 * @return: Jwts: cargado con el total de los elementos del token
	 */
	public String generatedToken(Authentication authentication){
		//Saca los roles y los separa por comas
		String authorities = authentication.getAuthorities().stream()
				.map(GrantedAuthority::getAuthority)
				.collect(Collectors.joining(","));

		Date currentDate = new Date();
		Date expirationDate = new Date(currentDate.getTime() + this.JWT_EXPIRATION_IN_MS);

		return Jwts.builder()
				.setSubject(authentication.getName())
				.claim(AUTHORITIES_KEY,authorities)
				.setIssuedAt(currentDate)
				.setExpiration(expirationDate)
				.signWith(this.getSecretKey(), SignatureAlgorithm.HS512)
				.compact();
	}

	/**
	 * Extrae los claims del token
	 *
	 * @param token: tipo String token de seguridad
	 * @return
	 */
	private Claims getAllClaimsFromToken(String token) {
		try {
			return Jwts.parserBuilder()
					//Se le pasa la firma en base 64 y en bytes
					.setSigningKey(this.getSecretBase64().getBytes())
					.build()
					.parseClaimsJws(token)
					.getBody();
		} catch (SecurityException e) {
			log.error("Invalid JWT signature: {}", e.getMessage());
			throw  new GlobalAppException(HttpStatus.UNAUTHORIZED, 4005,e.getMessage());
		} catch (MalformedJwtException e) {
			log.error("Invalid JWT token: {}", e.getMessage());
			throw  new GlobalAppException(HttpStatus.UNAUTHORIZED, 4006,e.getMessage());
		} catch (ExpiredJwtException e) {
			log.error("JWT token is expired: {}", e.getMessage());
			throw  new GlobalAppException(HttpStatus.UNAUTHORIZED, 4007,e.getMessage());
		} catch (UnsupportedJwtException e) {
			log.error("JWT token is unsupported: {}", e.getMessage());
			throw  new GlobalAppException(HttpStatus.UNAUTHORIZED, 4008,e.getMessage());
		} catch (IllegalArgumentException e) {
			log.error("JWT claims string is empty: {}", e.getMessage());
			throw  new GlobalAppException(HttpStatus.UNAUTHORIZED, 4009,e.getMessage());
		}
	}

	/**
	 * Extrae los claims
	 *
	 * @param authToken: tipo String token de seguridad
	 * @param clamsResolver -> Function<Claims, T> clamsResolver, recibe un Claims con el que devuelve un genérico
	 * @param <T> depende de la funcion que llamesmos, si devuelve el nombre, el tiempo de expiración, etc.
	 * @return
	 */
	private <T> T getClaimsFromToken(String authToken, Function<Claims, T> clamsResolver) {
		Claims claims = getAllClaimsFromToken(authToken);
		//R apply(T) -> define la función que se tomará como parametro un T y devolverá un R
		return clamsResolver.apply(claims);
	}

	/**
	 * Extrae el nombre de usuario del token de seguridad
	 *
	 * @param token
	 * @return
	 */
	public String getUserNameFromJwtToken(String token) {
		try {
			return this.getClaimsFromToken(token, Claims::getSubject);
		} catch (Exception ex) {
			log.error("Error when searching subject in token: {}",ex.getMessage() );
			return null;
		}
	}

	/**
	 * Verifica si el token expiró
	 *
	 * @param token: tipo String token de seguridad
	 * 	@return boolean:
	 * 	 <ul>
	 * 	 	<li>true: valid</li>
	 * 	 	<li>false: not valid</li>
	 * 	 </ul>
	 */
	public Boolean isTokenExpired(String token) {
		final Date expiration = this.getClaimsFromToken(token, Claims::getExpiration);
		return expiration.before(new Date());
	}



	/**
	 * Creamos un UsernamePasswordAuthenticationToken en función de
	 * su token y los datos del usuario
	 *
	 * @param token: tipo String token a verificar
	 * @param existingAuth: Authentication generado con las credenciales enviadas
	 * @param userDetails: usuario de tipo UserDetails
	 */
	public UsernamePasswordAuthenticationToken getAuthenticationToken
			(final String token,
			 final Authentication existingAuth,
			 final UserDetails userDetails) {

		/**
		 * Obtenemos los datos del token
		 */
		final JwtParser jwtParser = Jwts.parserBuilder().setSigningKey(this.getSecretBase64().getBytes()).build();

		/**
		 * Obtenemos los extra del payload
		 */
		final Jws<Claims> claimsJws = jwtParser.parseClaimsJws(token);

		final Claims claims = claimsJws.getBody();

		/**
		 * Extraemos las authorities, se uso roles para este proyecto
		 */
		final Collection<? extends GrantedAuthority> authorities =
				Arrays.stream(claims.get(AUTHORITIES_KEY).toString().split(","))
						.map(SimpleGrantedAuthority::new)
						.collect(Collectors.toList());

		return new UsernamePasswordAuthenticationToken(userDetails, "", authorities);
	}

	/**
	 * Generates TOKEN to validate the user's password change with email
	 *
	 * @param emial: type String
	 * @param expiration: type int
	 * @return token: type String
	 */
	public String generatedToken(String emial, int expiration){

		Date currentDate = new Date();
		Date expirationDate = new Date(currentDate.getTime() + expiration);

		return Jwts.builder()
				.setSubject(emial)
				.setIssuedAt(currentDate)
				.setExpiration(expirationDate)
				.signWith(this.getSecretKey(), SignatureAlgorithm.HS512)
				.compact();
	}

	/**
	 *Refresh token
	 *
	 * @param jwtDTO: tipe @JwtDTO
	 * @return @JwtDTO
	 */
	public JwtDTO getRefreshToken(JwtDTO jwtDTO){
		String jwt = this.refreshToken(jwtDTO);
		return JwtDTO
				.builder()
				.token(jwt)
				.build();
	}

	/**
	 * Security token update
	 *
	 * @param jwtDTO: tipe @JwtDTO
	 * @return String: string with JWT
	 * @throws ParseException
	 */
	public String refreshToken(JwtDTO jwtDTO) {
		/**
		 * Verificamos firma
		 */
		try{
			Jwts.parserBuilder()
					//Se le pasa la firma en base 64 y en bytes
					.setSigningKey(this.getSecretBase64().getBytes())
					.build()
					.parseClaimsJws(jwtDTO.getToken())
					.getBody();
		} catch (ExpiredJwtException e) {
			try {
				JWT jwt = JWTParser.parse(jwtDTO.getToken());
				JWTClaimsSet claims = jwt.getJWTClaimsSet();
				String username = claims.getSubject();
				String roles = (String) claims.getClaim(AUTHORITIES_KEY);
				Date currentDate = new Date();
				Date expirationDate = new Date(currentDate.getTime() + this.JWT_EXPIRATION_IN_MS);

				return Jwts.builder()
						.setSubject(username)
						.claim(AUTHORITIES_KEY, roles)
						.setIssuedAt(currentDate)
						.setExpiration(expirationDate)
						.signWith(this.getSecretKey(), SignatureAlgorithm.HS512)
						.compact();

			} catch (ParseException ex) {
				log.error("Refresh token error: {}", ex.getMessage());
				throw new GlobalAppException(HttpStatus.BAD_REQUEST, 4010,ex.getMessage());
			}
		}
		return null;
	}


}
