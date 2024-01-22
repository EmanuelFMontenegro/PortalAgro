package com.dgitalfactory.usersecurity.utils;

import jakarta.annotation.Nullable;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Component
public class UtilsCommons {

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private ResponseStatusMessages msgSource;

    private static final String DNI_REPEATED_REGEX = "(\\d)\\1{" + AppConstants.DNI_MIN + "," + AppConstants.DNI_MAX + "}";
    private static final String CUITCUIL_REPEATED_REGEX = "(\\d)\\1{" + AppConstants.CUIT_CUIL_MIN + "," + AppConstants.CUIT_CUIL_MAX + "}";
    private static final String TELEPHONE_REPEATED_REGEX = "(\\d)\\1{" + AppConstants.TELEPHONE_MIN + "," + AppConstants.TELPHONE_MAX + "}";

    /**
     * Searches for the code and returns the message if it is not found it returns a message by default
     * @param code: type int (code message)
     * @return String
     */
    public String getStatusMessage(int code){
        return msgSource.getMessage("response.code."+String.valueOf(code));
    }
    public String getStatusMessage(int code, Locale locale){
        return msgSource.getMessage("response.code."+String.valueOf(code), locale);
    }


    /**
     * Searches for the code and returns the message if it is not found it returns a message by default
     * @param message: type @{@link String} (message)
     * @return String
     */
    public String getMessage(String message){
        return msgSource.getMessage(message);
    }

    public String getMessage(String message, Locale locale){
        return msgSource.getMessage(message, locale);
    }

    /**
     * Searching for the message and formats with the object received by parameter
     * @param msgCode: type @{@link String} code message in message.properties
     * @param dynamicValues: all object needed to use with
     * @return
     */
    public String getFormatMessage(String msgCode, String... dynamicValues){
        String formatString = this.getMessage(msgCode);
        return String.format(formatString, (Object[]) dynamicValues);
    }

    /**
     * Searching for the message and formats with the object received by parameter
     * @param msgCode: type @{@link Integer} code message in message.properties
     * @param dynamicValues: all object needed to use with
     * @return
     */
    public String getFormatMessage(int msgCode, String... dynamicValues){
        String formatString = this.getStatusMessage(msgCode);
        return String.format(formatString, (Object[]) dynamicValues);
    }

    /**
     * Convert class entity to entityDTO
     * @param entity
     * @param dtoClass
     * @return dtoClass
     * @param <T> entityclass
     * @param <U> entityDTOclass
     */
    public <T, U> U convertEntityToDTO(T entity, Class<U> dtoClass) {
        return modelMapper.map(entity, dtoClass);
    }

    public <T, U> T convertDTOToEntity(U dto, Class<T> entityClass) {
        return modelMapper.map(dto, entityClass);
    }
    public <S, T> List<T> mapListEntityDTO(List<S> source, Class<T> targetClass) {
        return source
                .stream()
                .map(element -> modelMapper.map(element, targetClass))
                .collect(Collectors.toList());
    }

    /**
     * Verifica que el pasword contenga los minimos valores requeridos
     * <ul>
     *  <li>Al menos UNA letra MAYUSCULA</li>
     *  <li>Al menos UNA letra MINUSCULA</li>
     *  <li>Al menos UN NÚMERO</li>
     * </ul>
     *
     * @param password es el string a ser evaluado
     * @return <ul>
     *  <li>TRUE: si cumple con las condiciones</li>
     *  <li>FALSE: si incumple al menos una de las condiciones</li>
     * </ul>
     */
    public static boolean validPassword(String password) {
        // Verificar la longitud mínima
        if (password.length() < AppConstants.PASSWORD_MIN) {
            return false;
        }

        // Verificar la presencia de al menos una letra mayúscula, una letra minúscula y un número
        boolean mayuscula = false;
        boolean minuscula = false;
        boolean numero = false;

        // Verificar que no haya caracteres especiales
        boolean noCaracterEspecial = Pattern.matches("[a-zA-Z0-9]+", password);

        if (!noCaracterEspecial) {
            return false;
        }

        for (byte i = 0; i < password.length(); i++) {
            if (mayuscula && minuscula && numero) {
                return true;
            }
            String passValue = String.valueOf(password.charAt(i));
            if (passValue.matches("[A-Z]")) {
                mayuscula = true;
            } else if (passValue.matches("[a-z]")) {
                minuscula = true;
            } else if (passValue.matches("[0-9]")) {
                numero = true;
            }
        }
        return false;
    }

    /**
     * Comprueba que no se repitan numeros
     *
     * @param numero es numero a verificar
     * @param tipo   tipo de patron a evaluar (dni,cuitCuil, telefono)
     * @return @{@link Boolean}
     */
    public static boolean validarNumerosRepetidos(String numero, String tipo) {
        // Cargamos el patron de expresion a comprara .
        String patron = "";
        if (tipo.equals("dni")) {
            patron = DNI_REPEATED_REGEX;
        } else {
            if (tipo.equals("telefono")) {
                patron = TELEPHONE_REPEATED_REGEX;
            } else {
                if (tipo.equals("cuitCuil")) {
                    patron = CUITCUIL_REPEATED_REGEX;
                }
            }
        }
        Pattern pattern1 = Pattern.compile(patron, Pattern.MULTILINE);
        //verificar si pertence al patron
        Matcher matcher1 = pattern1.matcher(numero);
        return matcher1.matches();
    }

    /**
     * Comprueba que no se repitan numeros en una cadena que acepta dni y cuit/cuil
     *
     * @param numero es numero a verificar
     * @return @{@link Boolean}
     */
    public static boolean validarNumerosRepetidosDni(String numero) {
        String patron = "";
        patron = DNI_REPEATED_REGEX;
        Pattern pattern1 = Pattern.compile(patron, Pattern.MULTILINE);
        Matcher matcher1 = pattern1.matcher(numero);
        return matcher1.matches();
    }

    /**
     * Valid if is dni number by size
     * @param number: type {@link String}
     * @return @{@link Boolean}
     */
    public static boolean validateDNIBySize(String number) {
        return number.length() > (AppConstants.DNI_MIN - 1) && number.length() < (AppConstants.DNI_MAX + 1);
    }

    /**
     * Valid if is CUIT/CUIL number by size
     * @param number: type {@link String}
     * @return @{@link Boolean}
     */
    public static boolean validateCUITCUILBySize(String number) {
        return number.length() > (AppConstants.CUIT_CUIL_MIN - 1) && number.length() < (AppConstants.CUIT_CUIL_MAX + 1);
    }

    /**
     * Diferencia entre dos @{@link LocalDateTime} en minutos
     * @param start
     * @param end
     * @return lonf
     */
    public static long differenceLocalDataTime(LocalDateTime start, LocalDateTime end) {
        long difference = Duration.between(start, end).toMinutes();
        return difference;
    }



    /**
     * Convert @{@link LocalDateTime to String dd/MM/yyyy HH:mm}
     * @param date: type @{@link LocalDateTime}
     * @return String dd/MM/yyyy HH:mm
     */
    public static String convertLocalDateTimeToString(LocalDateTime date){
        // Definir el formato de salida
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        // Formatear el LocalDateTime
        return date.format(formatter);
    }

    /**
     * Check that the given {@code CharSequence} is neither {@code null} nor
     * of length 0.
     * <p>Note: this method returns {@code true} for a {@code CharSequence}
     * that purely consists of whitespace.
     * <p><pre class="code">
     * StringUtils.hasLength(null) = false
     * StringUtils.hasLength("") = false
     * StringUtils.hasLength(" ") = true
     * StringUtils.hasLength("Hello") = true
     * </pre>
     * @param str the {@code CharSequence} to check (may be {@code null})
     * @return {@code true} if the {@code CharSequence} is not {@code null} and has length
     * @see #hasLength(String)
     * @see #hasText(CharSequence)
     */
    public static boolean hasLength(@Nullable CharSequence str) {
        return (str != null && str.length() > 0);
    }

    /**
     * Check that the given {@code String} is neither {@code null} nor of length 0.
     * <p>Note: this method returns {@code true} for a {@code String} that
     * purely consists of whitespace.
     * @param str the {@code String} to check (may be {@code null})
     * @return {@code true} if the {@code String} is not {@code null} and has length
     * @see #hasLength(CharSequence)
     * @see #hasText(String)
     */
    public static boolean hasLength(@Nullable String str) {
        return (str != null && !str.isEmpty());
    }

    /**
     * Check whether the given {@code CharSequence} contains actual <em>text</em>.
     * <p>More specifically, this method returns {@code true} if the
     * {@code CharSequence} is not {@code null}, its length is greater than
     * 0, and it contains at least one non-whitespace character.
     * <p><pre class="code">
     * StringUtils.hasText(null) = false
     * StringUtils.hasText("") = false
     * StringUtils.hasText(" ") = false
     * StringUtils.hasText("12345") = true
     * StringUtils.hasText(" 12345 ") = true
     * </pre>
     * @param str the {@code CharSequence} to check (may be {@code null})
     * @return {@code true} if the {@code CharSequence} is not {@code null},
     * its length is greater than 0, and it does not contain whitespace only
     * @see #hasText(String)
     * @see #hasLength(CharSequence)
     * @see Character#isWhitespace
     */
    public static boolean hasText(@Nullable CharSequence str) {
        return (str != null && str.length() > 0 && containsText(str));
    }

    /**
     * Check whether the given {@code String} contains actual <em>text</em>.
     * <p>More specifically, this method returns {@code true} if the
     * {@code String} is not {@code null}, its length is greater than 0,
     * and it contains at least one non-whitespace character.
     * @param str the {@code String} to check (may be {@code null})
     * @return {@code true} if the {@code String} is not {@code null}, its
     * length is greater than 0, and it does not contain whitespace only
     * @see #hasText(CharSequence)
     * @see #hasLength(String)
     * @see Character#isWhitespace
     */
    public static boolean hasText(@Nullable String str) {
        return (str != null && !str.isEmpty() && containsText(str));
    }

    private static boolean containsText(CharSequence str) {
        int strLen = str.length();
        for (int i = 0; i < strLen; i++) {
            if (!Character.isWhitespace(str.charAt(i))) {
                return true;
            }
        }
        return false;
    }

    /**
     * Capitalize a {@code String}, changing the first letter to
     * upper case as per {@link Character#toUpperCase(char)}.
     * No other letters are changed.
     * @param str the {@code String} to capitalize
     * @return the capitalized {@code String}
     */
    public static String capitalize(String str) {
        return changeFirstCharacterCase(str, true);
    }

    /**
     * Uncapitalize a {@code String}, changing the first letter to
     * lower case as per {@link Character#toLowerCase(char)}.
     * No other letters are changed.
     * @param str the {@code String} to uncapitalize
     * @return the uncapitalized {@code String}
     */
    public static String uncapitalize(String str) {
        return changeFirstCharacterCase(str, false);
    }

    private static String changeFirstCharacterCase(String str, boolean capitalize) {
        if (!hasLength(str)) {
            return str;
        }

        char baseChar = str.charAt(0);
        char updatedChar;
        if (capitalize) {
            updatedChar = Character.toUpperCase(baseChar);
        }
        else {
            updatedChar = Character.toLowerCase(baseChar);
        }
        if (baseChar == updatedChar) {
            return str;
        }

        char[] chars = str.toCharArray();
        chars[0] = updatedChar;
        return new String(chars, 0, chars.length);
    }

    public static String capitalizeAllFirstLetters(String name)
    {
        char[] array = name.toCharArray();
        array[0] = Character.toUpperCase(array[0]);

        for (int i = 1; i < array.length; i++) {
            if (Character.isWhitespace(array[i - 1])) {
                array[i] = Character.toUpperCase(array[i]);
            }
        }

        return new String(array);
    }

}