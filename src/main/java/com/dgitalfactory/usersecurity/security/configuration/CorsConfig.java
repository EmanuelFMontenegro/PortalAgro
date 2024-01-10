package com.dgitalfactory.usersecurity.security.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry
                .addMapping("/api/**")
                .allowedOrigins("http://localhost:4200", "http://localhost")
                .allowedMethods(
                        HttpMethod.GET.name(),
                        HttpMethod.PUT.name(),
                        HttpMethod.POST.name(),
                        HttpMethod.DELETE.name())
                .allowedHeaders(
                        HttpHeaders.CONTENT_TYPE,
                        HttpHeaders.AUTHORIZATION,
                        HttpHeaders.ACCEPT_LANGUAGE)
                .exposedHeaders(HttpHeaders.CONTENT_TYPE) // Exponer el encabezado content-type
                .allowCredentials(true)
                .maxAge(3600)
                .exposedHeaders("Content-Type") // Permitir el encabezado Content-Type
                .exposedHeaders("Cache-Control") // Permitir el encabezado Cache-Control
                .exposedHeaders("Pragma") // Permitir el encabezado Pragma
                .exposedHeaders("Expires"); // Permitir el encabezado Expires
    }
}
