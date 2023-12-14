package com.dgitalfactory.usersecurity.security.configuration;

import com.dgitalfactory.usersecurity.security.exception.CustomAccessDeniedHandler;
import com.dgitalfactory.usersecurity.security.jwt.JWTAuthenticationFilter;
import com.dgitalfactory.usersecurity.security.jwt.JwtEntryPoint;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private AuthenticationProvider authProvider;

    @Autowired
    private JWTAuthenticationFilter jwtFilter;

    @Autowired
    private JwtEntryPoint jwtEntryPoint;

    @Autowired
    private CustomAccessDeniedHandler accessDeniedHandler;

    @Bean
    protected SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                //No utilizamos sessiones porque vamos a usar autenticcion por token
                .sessionManagement(sessionManager ->
                        sessionManager.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(builderRequestMatchers())
                .exceptionHandling(exhandler ->
                        exhandler.accessDeniedHandler(this.accessDeniedHandler)
                                .authenticationEntryPoint(this.jwtEntryPoint)
                )
                .authenticationProvider(authProvider)
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @NotNull
    private static Customizer<AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry> builderRequestMatchers() {
        return authorize -> authorize
                .requestMatchers(
                        "/api-docs.yml",
                        "/api-docs/**",
                        "/swagger-ui.html",
                        "/swagger-ui/**",
                        "/swagger-ui/index.html",
                        "/configuration/ui",
                        "/configuration/**",
                        "/swagger-resources/**",
                        "/webjars/**"
                ).permitAll()
                .requestMatchers(HttpMethod.GET, "/api/img/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/email/activate-account/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/email/recovery").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/email/change-pass").permitAll()
                .anyRequest().authenticated()
                ;
    }
}
