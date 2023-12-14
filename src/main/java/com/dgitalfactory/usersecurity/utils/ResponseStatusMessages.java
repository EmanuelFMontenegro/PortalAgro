package com.dgitalfactory.usersecurity.utils;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 04/12/2023 - 09:42
 */

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import java.util.Locale;

/**
 * This class maps the error, warning and info messages from the file messages.properties
 */
@Service
public class ResponseStatusMessages {

    @Autowired
    private MessageSource messageSource;


    public String getMessage(String message, Locale locale, String... dynamicValues) {
        return messageSource.getMessage(message, dynamicValues, locale);
    }

    public String getMessage(String message, String... dynamicValues) {
        return messageSource.getMessage(message, dynamicValues, LocaleContextHolder.getLocale());
    }
}
