package com.dgitalfactory.usersecurity.DTO;

import lombok.Builder;
import lombok.Data;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Data
@Builder
public class ErrorDTO {
    private Date date_error;
    private String code;
    private String message;
    private String details;
    private Map<String, String> listDetails = new HashMap<>();
}
