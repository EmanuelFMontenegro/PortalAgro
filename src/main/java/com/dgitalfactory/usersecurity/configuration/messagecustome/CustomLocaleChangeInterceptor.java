package com.dgitalfactory.usersecurity.configuration.messagecustome;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;

import java.util.Locale;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 12/12/2023 - 10:04
 */
@Component
public class CustomLocaleChangeInterceptor extends LocaleChangeInterceptor {
    private static final String DEFAULT_LOCALE = "es_AR";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws ServletException {
        String lang = request.getParameter(getParamName());
        if (lang == null) {
            lang = DEFAULT_LOCALE; // Establece el idioma predeterminado si no se proporciona lang
        }
        Locale locale = StringUtils.parseLocaleString(lang);
        request.getSession().setAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME, locale);
        return super.preHandle(request, response, handler);
    }
}
