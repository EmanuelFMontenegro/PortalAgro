package com.dgitalfactory.usersecurity.security.jwt;

import com.dgitalfactory.usersecurity.DTO.ErrorDTO;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Component
public class JwtEntryPoint implements AuthenticationEntryPoint {

    private static final Logger log = LoggerFactory.getLogger(JwtEntryPoint.class);

    @Autowired
    private UtilsCommons utilsCommons;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        log.error("Unauthorized error (entry point): {}", authException.getMessage());

//      response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Error: Unauthorized");
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(4025)
                .message(utilsCommons.getStatusMessage(4025))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path( request.getServletPath())
                .details(authException.getMessage())
                .build();

        final ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(response.getOutputStream(), errorDTO);
    }
}
