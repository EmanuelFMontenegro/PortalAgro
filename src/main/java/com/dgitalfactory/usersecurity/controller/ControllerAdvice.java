package com.dgitalfactory.usersecurity.controller;

import com.dgitalfactory.usersecurity.DTO.ErrorDTO;
import com.dgitalfactory.usersecurity.emailpassword.exception.EmailExecption;
import com.dgitalfactory.usersecurity.exception.GlobalAppException;
import com.dgitalfactory.usersecurity.exception.ResourceNotFoundException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.net.UnknownHostException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ControllerAdvice {

    /**
     * Error global de tipo RuntimeException
     *
     * @param ex: tipo RuntimeException
     * @return ResponseEntity<ErrorDTO>
     */
    @ExceptionHandler(value = RuntimeException.class)
    public ResponseEntity<ErrorDTO> getRuntimeExceptionHandler(RuntimeException ex) {
        ErrorDTO error = ErrorDTO.builder().date_error(new Date()).code("Algun error general del diccionario").message(ex.getMessage()).build();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    /**
     * Error de tipo ResourceNotFoundException, cuando un campo no cumple con las condiciones
     * en una busqueda o en la constitución de una clase
     *
     * @param ex: tipo ResourceNotFoundException(String nameResource, String fieldName, Object fieldValue)
     * @return ResponseEntity<ErrorDTO>
     */
    @ExceptionHandler(value = ResourceNotFoundException.class)
    public ResponseEntity<ErrorDTO> getRuntimeExceptionHandler(ResourceNotFoundException ex) {
        ErrorDTO error = ErrorDTO.builder().date_error(new Date()).code("P-500").message(ex.getMessage()).build();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    /**
     * Constructor generico para errores
     *
     * @param ex: tipo GlobalAppException(HttpStatus status, String message, String code)
     * @return: ResponseEntity<ErrorDTO>
     */
    @ExceptionHandler(value = GlobalAppException.class)
    public ResponseEntity<ErrorDTO> getGlobalErrorHandler(GlobalAppException ex) {
        ErrorDTO error = ErrorDTO.builder()
                .date_error(new Date())
                .code(ex.getCode())
                .message(ex.getMessage())
                .build();
        return new ResponseEntity<>(error, ex.getStatus());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDTO> getGobalException(Exception ex, WebRequest webRequest) {
        ErrorDTO error = ErrorDTO.builder()
                .date_error(new Date())
                .message(ex.getMessage())
                .details(webRequest.getDescription(false))
                .build();
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String nameFild = ((FieldError) error).getField();
            String message = error.getDefaultMessage();
            errors.put(nameFild, message);
        });
        ErrorDTO errorDTO = ErrorDTO.builder()
                .date_error(new Date())
                .message("Validation Error: ")
                .listDetails(errors)
                .build();
        return new ResponseEntity<>(errorDTO, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(UnknownHostException.class)
    protected ResponseEntity<Object> handleMailException(UnknownHostException ex) {
//    MailPreparationException- en caso de fallo al preparar un mensaje
//    MailParseException- en caso de fallo al analizar un mensaje
//    MailAuthenticationException- en caso de fallo de autenticación
//    MailSendException- en caso de fallo al enviar un mensaje
//    MailException
        ErrorDTO errorDTO = ErrorDTO.builder()
                .date_error(new Date())
                .code(HttpStatus.INTERNAL_SERVER_ERROR.toString())
                .message("Mail server connection failed")
                .build();
        return new ResponseEntity<>(errorDTO, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    @ExceptionHandler(EmailExecption.class)
    protected ResponseEntity<Object> handleMailException(EmailExecption ex) {
//    MailPreparationException- en caso de fallo al preparar un mensaje
//    MailParseException- en caso de fallo al analizar un mensaje
//    MailAuthenticationException- en caso de fallo de autenticación
//    MailSendException- en caso de fallo al enviar un mensaje
//    MailException
        ErrorDTO errorDTO = ErrorDTO.builder()
                .date_error(new Date())
                .code(ex.getCode())
                .message("Error email send.")
                .build();
        return new ResponseEntity<>(errorDTO, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
