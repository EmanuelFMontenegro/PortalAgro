package com.dgitalfactory.usersecurity.exception;

import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Data
public class GlobalAppException extends RuntimeException {
    @Getter(value = AccessLevel.NONE)
    @Setter(value = AccessLevel.NONE)
    private static final long serialVersionUID = 1L;

    private String code;
    private HttpStatus status;

    public GlobalAppException(HttpStatus status, String message, String code) {
        super(message);
        this.code = code;
        this.status = status;
    }
}