package com.dgitalfactory.usersecurity.security.exception;

import com.dgitalfactory.usersecurity.security.jwt.JwtEntryPoint;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.OutputStream;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class CustomAccessDeniedHandler extends Throwable implements AccessDeniedHandler {

    private static final Logger log = LoggerFactory.getLogger(CustomAccessDeniedHandler.class);

    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException, ServletException {

        log.error("Unauthorized error (entry point): {}", accessDeniedException.getMessage());

        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.setContentType("application/json");
        Map<String, Object> data = new HashMap<>();
        data.put("timestamp", new Date());
        data.put("status",HttpStatus.FORBIDDEN.value());
        data.put("message", "Access Denied, login again!");
        data.put("path", request.getRequestURL().toString());
//        data.put("pd", "Have a good day :)");

        OutputStream out = response.getOutputStream();
        ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(out, data);
        out.flush();


    }
}
