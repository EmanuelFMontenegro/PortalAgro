package com.dgitalfactory.usersecurity.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class UtilsCommons {
    public static final int dniMaxima = 10;
    public static final int dniMin = 7;
    public static final int cuitCuilMaxima = 10 + 3;
    public static final int cuitCuilMin = 7 + 3;
    public static final int telefonoMaximo = 15;
    public static final int telefonoMinimo = 6;
    private static final String dniNumeroRepetido = "(\\d)\\1{" + dniMin + "," + dniMaxima + "}";
    private static final String cuitCuilRepetido = "(\\d)\\1{" + cuitCuilMin + "," + cuitCuilMaxima + "}";
    private static final String numeroTelefonicoRepetido = "(\\d)\\1{" + telefonoMinimo + "," + telefonoMaximo + "}";



    /**
     * Verifica que el pasword contenga los minimos valores requeridos
     * <ul>
     *  <li>Al menos UNA letra MAYUSCULA</li>
     *  <li>Al menos UNA letra MINUSCULA</li>
     *  <li>Al menos UN NÚMERO</li>
     * </ul>
     *
     * @param password es el string a ser evaluado
     * @return
     * <ul>
     *  <li>TRUE: si cumple con las condiciones</li>
     *  <li>FALSE: si incumple al menos una de las condiciones</li>
     * </ul>
     */
    public static boolean validPassword(String password) {
        if (password.length() < 8) {
            return false;
        }
        boolean mayuscula = false;
        boolean minuscula = false;
        boolean numero = false;

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
     * @param tipo tipo de patron a evaluar (dni,cuitCuil, telefono)
     * @return
     */
    public static boolean validarNumerosRepetidos(String numero, String tipo) {
        // Cargamos el patron de expresion a comprara .
        String patron = "";
        if (tipo.equals("dni")) {
            patron = dniNumeroRepetido;
        } else {
            if (tipo.equals("telefono")) {
                patron = numeroTelefonicoRepetido;
            } else {
                if (tipo.equals("cuitCuil")) {
                    patron = cuitCuilRepetido;
                }
            }
        }
        Pattern pattern1 = Pattern.compile(patron, Pattern.MULTILINE);
        //verificar si pertence al patron
        Matcher matcher1 = pattern1.matcher(numero);
        return matcher1.matches();
    }
}
