package com.dgitalfactory.usersecurity.security.jwt;

import com.dgitalfactory.usersecurity.security.service.JwtTokenService;
import com.dgitalfactory.usersecurity.security.service.SecurityUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Component
public class JWTAuthenticationFilter extends OncePerRequestFilter {

    @Value("${jwt.header.string}")
    public String HEADER_STRING;

    @Value("${jwt.token.prefix}")
    public String TOKEN_PREFIX;

    @Autowired
    private JwtTokenService jwtSVC;

    @Autowired
    private SecurityUserDetailsService userDetails;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader(HEADER_STRING);
        String username = null;
        String authToken = null;

        //Ckeck if the prefix Token (Bearer) is in the header
        if (header != null && header.startsWith(TOKEN_PREFIX)) {
            //If the token prefix exists we removed it
            authToken = header.replace(TOKEN_PREFIX, "");
            username = this.jwtSVC.getUserNameFromJwtToken(authToken);
        }

        /**
         * Verificamos que cuando extraemos del usuario exista y
         * si no esta dentro del contexto de persistencia de Security
         * Cargamos al usuario con el metodo loadUserByUsername de nuestro
         * custom UserDetails
         */
        if(username!= null && SecurityContextHolder.getContext().getAuthentication()==null){
            /**
             * Verifica el usuario y si lo encuentra lo devuelve
             */
            UserDetails userDetails = this.userDetails.loadUserByUsername(username);

            /**
             * Verificamos al usuario
             */
            UsernamePasswordAuthenticationToken authenticationToken = this.jwtSVC.getAuthenticationToken(
                    authToken,
                    SecurityContextHolder.getContext().getAuthentication(),
                    userDetails);


            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            // Establecemos la seguridad
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }

        /**
         * Si no encontramos o no el token
         * debemos pasar el el mando a la cadena de filtro
         */
		filterChain.doFilter(request, response);
    }

    /**
     * Bearer token to access (obtener token de la solicitud)
     *
     * @param request
     * @return String or null
     * <ul>
     *     <li>String token: si "Authorization" existe y tiene un token</li>
     *     <li>null: ni no encuentra el token</li>
     * </ul>
     */
    private String getJWTRequest(HttpServletRequest request) {
        String bearerHeader = request.getHeader(HEADER_STRING);
        if (StringUtils.hasText(bearerHeader) && bearerHeader.startsWith("Bearer ")) {
            return bearerHeader.substring(7, bearerHeader.length());
        }
        return null;
    }
}
