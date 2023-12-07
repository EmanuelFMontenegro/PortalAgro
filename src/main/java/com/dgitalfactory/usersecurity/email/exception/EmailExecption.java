package com.dgitalfactory.usersecurity.email.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Getter
public class EmailExecption extends MailException {
    private String code = HttpStatus.INTERNAL_SERVER_ERROR.toString();
    public EmailExecption(String msg, Throwable cause) {

        super("Error sending email.  "+msg, cause);
    }

//    MailPreparationException- en caso de fallo al preparar un mensaje
//    MailParseException- en caso de fallo al analizar un mensaje
//    MailAuthenticationException- en caso de fallo de autenticación
//    MailSendException- en caso de fallo al enviar un mensaje
//    MailException
}
