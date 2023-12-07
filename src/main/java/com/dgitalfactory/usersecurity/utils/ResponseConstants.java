package com.dgitalfactory.usersecurity.utils;

import com.dgitalfactory.usersecurity.exception.GlobalAppException;
import com.dgitalfactory.usersecurity.exception.ResourceConstantsDefoultException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.stream.Collectors;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 04/12/2023 - 09:42
 */

/**
 * This class maps the error, warning and info messages from the file message.properties
 */
public class ResponseConstants {
    public static final Map<Integer, String> responseCodeMap = new HashMap<>();

    static {
        Properties properties = new Properties();
        try {
            properties.load(ResponseConstants.class.getClassLoader().getResourceAsStream("message.properties"));

            responseCodeMap.putAll(properties.entrySet().stream()
                    .filter(entry -> entry.getKey().toString().startsWith("response.code."))
                    .collect(Collectors.toMap(
                            entry -> Integer.parseInt(entry.getKey().toString().replace("response.code.", "")),
                            entry -> entry.getValue().toString())
                    ));
        } catch (IOException e) {
           throw  new ResourceConstantsDefoultException(HttpStatus.INTERNAL_SERVER_ERROR, 996,e.getMessage());
        }
    }
}
