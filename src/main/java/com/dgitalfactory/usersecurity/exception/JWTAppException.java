package com.dgitalfactory.usersecurity.exception;

import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Data
public class JWTAppException extends RuntimeException {
    @Getter(value = AccessLevel.NONE)
    @Setter(value = AccessLevel.NONE)
    private static final long serialVersionUID = 1L;

    private int code;
    private HttpStatus status;
    private String details;

    public JWTAppException(int code, String details) {
        super(details);
        this.code = code;
        this.status = HttpStatus.UNAUTHORIZED;
        this.details= details;
    }
}