package com.dgitalfactory.usersecurity.utils;

public class UtilsCommons {
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
}
