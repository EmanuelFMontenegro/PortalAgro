package com.dgitalfactory.usersecurity.security.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry
                .addMapping("/api/**")
                    .allowedOrigins("http://localhost:4200","http://localhost")
                    .allowedMethods(
                            HttpMethod.GET.name(),
                            HttpMethod.PUT.name(),
                            HttpMethod.POST.name(),
                            HttpMethod.DELETE.name())
                    .allowedHeaders(HttpHeaders.CONTENT_TYPE,HttpHeaders.AUTHORIZATION)
                    .allowCredentials(true).maxAge(3600);
    }
}
