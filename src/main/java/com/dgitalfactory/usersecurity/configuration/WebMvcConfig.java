package com.dgitalfactory.usersecurity.configuration;

import com.dgitalfactory.usersecurity.exception.CustomExceptionHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 07/12/2023 - 19:50
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Autowired
    private CustomExceptionHandler customExceptionHandler;

    @Override
    public void extendHandlerExceptionResolvers(List<HandlerExceptionResolver> resolvers) {
        resolvers.add(customExceptionHandler);
    }
}
