package com.dgitalfactory.usersecurity.DTO;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Data
@Builder
public class ErrorDTO {
    private String date;
    private int code;
    private String message;
    private String details;
    private String path;
    private Map<String, String> listDetails = new HashMap<>();
}
