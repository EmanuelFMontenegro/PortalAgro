package com.dgitalfactory.usersecurity.utils;

import com.dgitalfactory.usersecurity.exception.GlobalAppException;
import com.dgitalfactory.usersecurity.exception.ResourceNotFoundException;
import org.springframework.http.HttpStatus;

import java.text.DecimalFormat;
import java.util.Objects;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 06/12/2023 - 08:48
 */
public class NumberUtils {
    /**
     * Takes a decimal number with many decimal places and rounds it
     * @param num: type @{@link Float}
     * @return @{@link Float}
     */
    public static float getDecimalRounding(float num){
        DecimalFormat decimalFormat = new DecimalFormat("#.##");
        String decimalFormatStr = decimalFormat.format(num);
        return Float.parseFloat(decimalFormatStr);
    }

    /**
     * Takes a decimal number with many decimal places and rounds it
     * @param num: type @{@link String}
     * @return @{@link Float}
     */
    public static float getDecimalRoundingStrFloat(String num){
        DecimalFormat decimalFormat = new DecimalFormat("#.##");
        String decimalFormatStr = decimalFormat.format(num);
        return Float.parseFloat(decimalFormatStr);
    }

    /**
     * Takes a decimal number with many decimal places and rounds it
     * @param num: type @{@link String}
     * @return @{@link String}
     */
    public static String getDecimalRounding(String num){
        isFloat(num);
        DecimalFormat decimalFormat = new DecimalFormat("#.##");
        return decimalFormat.format(num);
    }

    /**
     * Convert String to float
     * @param number: type {@link String}
     * @return @{@link Float}
     */
    public static float getStringToFloat(String number){
        try {
            float numberFloat = Float.parseFloat(number);
            return getDecimalRounding(numberFloat);
        } catch (NumberFormatException ex) {
            throw new GlobalAppException(HttpStatus.NOT_FOUND,4012,ex.getMessage());
        }
    }

    /**
     * Verify if an object is of type flat
     * @param object: type {@link Object}
     * @return @{@link Boolean}
     */
    public static boolean isFloat(Object object) {
        if (object == null) {
            return false;
        }
        try {
            Float.parseFloat(object.toString());
            return true; // Si no hay excepción, el objeto puede ser convertido a Float
        } catch (NumberFormatException e) {
            return false; // La conversión falló, el objeto no es un Float válido
        }
    }

    /**
     * Parse millis to minutes
     * @param milis: type {@link Long}
     * @return @{@link Long}
     */
    public static long parseMillisToMunutes(long milis) {
        return milis/60000;
    }
}
