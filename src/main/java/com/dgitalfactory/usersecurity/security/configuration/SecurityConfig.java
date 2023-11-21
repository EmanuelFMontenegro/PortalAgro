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

    //Endpoint level authorization
    // ---- Matcher
    // 1. AnyRequest
    // 2. RequestMatchers
    // 3. RequestMatchers with HttpMethod

    // ---- Authorization rule
    // 1. PermitAll
    // 2. DenyAll
    // 3. Authenticated
    // 4. HasRole
    // 5. HasAuthority
    // 6. Access (SpEL) - Spring Expression Language

    @Bean
    protected SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        http
                .csrf(csrf -> csrf.disable())
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
//                .requestMatchers("/v2/api-docs",
//                        "/swagger-resources",
//                        "/swagger-resources/**",
//                        "/configuration/ui",
//                        "/configuration/security",
//                        "/swagger-ui/**",
//                        "/webjars/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/email/recovery").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/email/change-pass").permitAll()
                .anyRequest().authenticated()
//              .requestMatchers(HttpMethod.POST,"/add").hasRole("ADMIN")
//              .requestMatchers(HttpMethod.GET,"/add").authenticated()
//              .requestMatchers("/public").permitAll()
//              .requestMatchers("/admin").hasRole("ADMIN")
//              .requestMatchers("/operator").hasAnyRole("OPERATOR","ADMIN")
                ;
    }
}
