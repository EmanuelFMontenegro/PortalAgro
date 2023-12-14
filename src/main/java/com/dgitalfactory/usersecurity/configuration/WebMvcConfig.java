package com.dgitalfactory.usersecurity.configuration;

import com.dgitalfactory.usersecurity.configuration.messagecustome.CustomLocaleChangeInterceptor;
import com.dgitalfactory.usersecurity.exception.CustomExceptionHandler;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;

import java.util.List;
import java.util.Locale;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 07/12/2023 - 19:50
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Autowired
    private CustomExceptionHandler customExceptionHandler;

    @Autowired
    private CustomLocaleChangeInterceptor customLocaleChangeInterceptor;

    @Override
    public void extendHandlerExceptionResolvers(List<HandlerExceptionResolver> resolvers) {
        resolvers.add(customExceptionHandler);
    }

    private static final String DEFAULT_LOCALE = "es_AR";

    @Bean
    public LocaleResolver localeResolver() {
        /**
         * Por sesiones, esto cambia solo cuando se lo pedimos
         * si pasamos una ruta sin el lenguaje queda el lenguaje anteror
         * por lo que si hay muchas solicitudes de lugares distintos
         * si nos olvidamos poner el lenguaje nos quedaremos con el ultimo seleccionado
         */
        SessionLocaleResolver localeResolver = new SessionLocaleResolver();
        localeResolver.setDefaultLocale(Locale.forLanguageTag(DEFAULT_LOCALE)); // Establece el español como idioma predeterminado
        return localeResolver;
    }

    @Bean
    public LocaleChangeInterceptor localeChangeInterceptor() {
        LocaleChangeInterceptor localeChangeInterceptor=new CustomLocaleChangeInterceptor();
        localeChangeInterceptor.setParamName("lang");// Parámetro que cambiará el idioma
        return localeChangeInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(localeChangeInterceptor());
    }
}
