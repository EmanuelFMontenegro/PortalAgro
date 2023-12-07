package com.dgitalfactory.usersecurity.DTO.custom_validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 06/12/2023 - 11:22
 */
@Documented
@Constraint(validatedBy = FloatValidate.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface IsFloatValid {
    String message() default "El campo no es válido. Debe ser un número desimal de tipo 'xxxx,xx'";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}

