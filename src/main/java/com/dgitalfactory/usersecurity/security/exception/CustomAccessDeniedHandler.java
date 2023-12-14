package com.dgitalfactory.usersecurity.security.exception;

import com.dgitalfactory.usersecurity.DTO.ErrorDTO;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.OutputStream;
import java.time.LocalDateTime;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Component
public class CustomAccessDeniedHandler extends Throwable implements AccessDeniedHandler {

    private static final Logger log = LoggerFactory.getLogger(CustomAccessDeniedHandler.class);

    @Autowired
    private UtilsCommons utilsCommons;

    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException, ServletException {

        log.error("Unauthorized error (entry point): {}", accessDeniedException.getMessage());
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.setContentType("application/json");
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(403)
                .message(utilsCommons.getErrorMessage(403))
                .date(utilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getRequestURL().toString().replace("url=",""))
                .details(accessDeniedException.getMessage())
                .build();

        OutputStream out = response.getOutputStream();
        ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(out, errorDTO);
        out.flush();
    }
}
