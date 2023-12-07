package com.dgitalfactory.usersecurity.DTO.custom_validator;

import com.dgitalfactory.usersecurity.utils.NumberUtils;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;


/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 06/12/2023 - 11:10
 */
public class FloatValidate implements ConstraintValidator<IsFloatValid, Object> {

    IsFloatValid context;

    @Override
    public void initialize(IsFloatValid floatValid) {
        ConstraintValidator.super.initialize(floatValid);
    }

    @Override
    public boolean isValid(Object input, ConstraintValidatorContext context) {
        if(input==null){
            return false;
        }
        if (!NumberUtils.isFloat(input)) {
            return false;
        }
        if(input instanceof String){
            String inputStr = (String) input;
            if(inputStr.isBlank()){
                return false;
            }
        }
        return true;
    }

//    private void addConstraintViolation(ConstraintValidatorContext context, String fieldName, String message) {
//        context.disableDefaultConstraintViolation();
//        context.buildConstraintViolationWithTemplate(message)
//                .addPropertyNode(fieldName)
//                .addConstraintViolation();
//    }
}
