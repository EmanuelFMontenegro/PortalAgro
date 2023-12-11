package com.dgitalfactory.usersecurity.controller;

import com.dgitalfactory.usersecurity.DTO.ErrorDTO;
import com.dgitalfactory.usersecurity.email.exception.EmailExecption;
import com.dgitalfactory.usersecurity.exception.GlobalAppException;
import com.dgitalfactory.usersecurity.exception.ResourceConstantsDefoultException;
import com.dgitalfactory.usersecurity.exception.ResourceNotFoundException;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import org.hibernate.exception.SQLGrammarException;
import org.modelmapper.MappingException;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.io.IOException;
import java.net.UnknownHostException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@RestControllerAdvice
public class AdviceControllerExceptionHandler {


    /**
     * Error de tipo ResourceNotFoundException, cuando un campo no cumple con las condiciones
     * en una busqueda o en la constitución de una clase
     *
     * @param ex: tipo ResourceNotFoundException(String nameResource, String fieldName, Object fieldValue)
     * @return ResponseEntity<ErrorDTO>
     */
    @ExceptionHandler(value = ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ErrorDTO> getResourceNotFoundException(ResourceNotFoundException ex,
                                                                 WebRequest request) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(4011)
                .message(UtilsCommons.getResponseConstants(4011))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=",""))
                .details(ex.getMessage())
                .build();
        return new ResponseEntity<>(errorDTO, HttpStatus.NOT_FOUND);
    }


    @ExceptionHandler(value = MappingException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ErrorDTO> getMappingException(MappingException ex,
                                                                              WebRequest request) {
              ErrorDTO errorDTO = ErrorDTO.builder()
                .code(4028)
                .message(UtilsCommons.getResponseConstants(4028))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=",""))
                .details(ex.getMessage())
                .build();
        return new ResponseEntity<>(errorDTO, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = HttpRequestMethodNotSupportedException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ErrorDTO> getHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException ex,
                                                                       WebRequest request) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(4027)
                .message(UtilsCommons.getResponseConstants(4027))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=",""))
                .details(ex.getMessage())
                .build();
        return new ResponseEntity<>(errorDTO, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ErrorDTO> getHttpMessageNotReadableException(HttpMessageNotReadableException ex,
                                                                 WebRequest request) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(4026)
                .message(UtilsCommons.getResponseConstants(4026))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=",""))
                .details(ex.getMessage())
                .build();
        return new ResponseEntity<>(errorDTO, HttpStatus.NOT_FOUND);
    }

    /**
     * Constructor generico para errores
     *
     * @param ex: tipo GlobalAppException(HttpStatus status, String message, String code)
     * @return: ResponseEntity<ErrorDTO>
     */
    @ExceptionHandler(value = GlobalAppException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ErrorDTO> getGlobalErrorHandler(GlobalAppException ex,WebRequest request) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(ex.getCode())
                .message(UtilsCommons.getResponseConstants(ex.getCode()))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .details(ex.getDetails())
                .path(request.getDescription(false).replace("uri=",""))
                .build();
        return new ResponseEntity<>(errorDTO, ex.getStatus());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, WebRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String nameFild = ((FieldError) error).getField();
            String message = error.getDefaultMessage();
            errors.put(nameFild, message);
        });
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(4012)
                .message(UtilsCommons.getResponseConstants(4012))
                .listDetails(errors)
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=",""))
                .build();
        return new ResponseEntity<>(errorDTO, HttpStatus.BAD_REQUEST);
    }


    /**
     * ERROR CUANDO EL USUARIO ESTA BLOQUEADO PRO EL @{@link com.dgitalfactory.usersecurity.security.configuration.CustomAuthenticationProvider}
     * @param ex: type {@link LockedException}
     * @return
     */
    @ExceptionHandler(LockedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    protected ResponseEntity<Object> getLockedException(LockedException ex, WebRequest request) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(4017)
                .message(UtilsCommons.getResponseConstants(4017))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=",""))
                .details(ex.getMessage())
                .build();
        return new ResponseEntity<>(errorDTO, HttpStatus.UNAUTHORIZED);
    }

    /**
     * ERROR QUE PRODUCE AL CONSULTAR EN LA BASE DE DATOS POR QUERY
     * @param ex
     * @return
     */
    @ExceptionHandler(InvalidDataAccessApiUsageException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    protected ResponseEntity<Object> getInvalidDataAccessApiUsageException(InvalidDataAccessApiUsageException ex, WebRequest request) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(5001)
                .message(UtilsCommons.getResponseConstants(5001))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=",""))
                .details(ex.getMessage())
                .build();
        return new ResponseEntity<>(errorDTO, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * ERROR QUE PRODUCE EL @{@link com.dgitalfactory.usersecurity.security.configuration.CustomAuthenticationProvider}
     * @param error
     * @return
     */
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    protected ResponseEntity<Object> getBadCredentialsException(AccessDeniedException error, WebRequest request) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(403)
                .message(UtilsCommons.getResponseConstants(403))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=",""))
                .details("Puede que tu el alcance de tu rol no te de acceso a este recurso. Intenta iniciar sesión nuevamente e intentalo de nuevo, de lo contrario comunicate con tu administrador")
                .build();
        return new ResponseEntity<>(errorDTO, HttpStatus.FORBIDDEN);
    }
    /**
     * ERROR QUE PRODUCE EL @{@link com.dgitalfactory.usersecurity.security.configuration.CustomAuthenticationProvider}
     * @param error
     * @return
     */
    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    protected ResponseEntity<Object> getBadCredentialsException(BadCredentialsException error, WebRequest request) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(4016)
                .message(UtilsCommons.getResponseConstants(4016))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=",""))
                .details(error.getMessage())
                .build();
        return new ResponseEntity<>(errorDTO, HttpStatus.BAD_REQUEST);
    }

    /**
     * Error general @{@link IOException}
     * @param ex
     * @param request
     * @return
     */
    @ExceptionHandler(IOException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<Object> handleIOException(IOException ex, WebRequest request) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(995)
                .message(UtilsCommons.getResponseConstants(995))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=",""))
                .details(ex.getMessage())
                .build();
        return new ResponseEntity<>(errorDTO, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(UnknownHostException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    protected ResponseEntity<Object> getUnknownHostException(UnknownHostException ex, WebRequest request) {
//    MailPreparationException- en caso de fallo al preparar un mensaje
//    MailParseException- en caso de fallo al analizar un mensaje
//    MailAuthenticationException- en caso de fallo de autenticación
//    MailSendException- en caso de fallo al enviar un mensaje
//    MailException
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(4003)
                .message(UtilsCommons.getResponseConstants(4003))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=",""))
                .details(ex.getMessage())
                .build();
        return new ResponseEntity<>(errorDTO, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    @ExceptionHandler(EmailExecption.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    protected ResponseEntity<Object> getEmailExecption(EmailExecption ex, WebRequest request) {
//    MailPreparationException- en caso de fallo al preparar un mensaje
//    MailParseException- en caso de fallo al analizar un mensaje
//    MailAuthenticationException- en caso de fallo de autenticación
//    MailSendException- en caso de fallo al enviar un mensaje
//    MailException
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(4003)
                .message(UtilsCommons.getResponseConstants(4003))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=",""))
                .details(ex.getMessage())
                .build();
        return new ResponseEntity<>(errorDTO, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(ResourceConstantsDefoultException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<ErrorDTO> getResourceConstantsDefoultException(ResourceConstantsDefoultException ex, WebRequest request) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(ex.getCode())
                .message("Error de mapeo clase ResourceConstants")
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .details(ex.getMessage())
                .path(request.getDescription(false).replace("uri=",""))
                .build();
        return new ResponseEntity<>(errorDTO,ex.getStatus());
    }

    /**
     * Error global de tipo RuntimeException
     *
     * @param ex: tipo RuntimeException
     * @return ResponseEntity<ErrorDTO>
     */
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(value = RuntimeException.class)
    public ResponseEntity<ErrorDTO> getRuntimeExceptionHandler(RuntimeException ex, WebRequest request) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(998)
                .message(UtilsCommons.getResponseConstants(998))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=",""))
                .details(ex.getMessage())
                .build();
        return new ResponseEntity<>(errorDTO, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<ErrorDTO> getGobalException(Exception ex, WebRequest request) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(997)
                .message(UtilsCommons.getResponseConstants(997))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=",""))
                .details(ex.getMessage())
                .build();
        return new ResponseEntity<>(errorDTO, HttpStatus.INTERNAL_SERVER_ERROR);
    }


    @ExceptionHandler(SQLGrammarException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<ErrorDTO> getSqlExceptionHelper(SQLGrammarException ex, WebRequest request) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(994)
                .message(UtilsCommons.getResponseConstants(994))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=",""))
                .details(ex.getMessage())
                .build();
        return new ResponseEntity<>(errorDTO, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
