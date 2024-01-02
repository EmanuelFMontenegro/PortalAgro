package com.dgitalfactory.usersecurity.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 07/12/2023 - 19:43
 */
@Component
public class JWTExceptionHandler implements HandlerExceptionResolver {
    @Override
    public ModelAndView resolveException(@NotNull HttpServletRequest request, @NotNull HttpServletResponse response, Object handler, Exception ex) {
        if (ex instanceof JWTAppException appException) {
            response.setStatus(appException.getStatus().value());
            ModelAndView mav = new ModelAndView("error");
            mav.addObject("JWT Error", ex.getMessage());
            return mav;
        }
        return null; // Dejar que otros manejadores de excepciones lo manejen si no es una JWTAppException
    }
}
