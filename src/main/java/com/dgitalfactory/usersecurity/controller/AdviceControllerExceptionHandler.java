package com.dgitalfactory.usersecurity.controller;

import com.dgitalfactory.usersecurity.DTO.ErrorDTO;
import com.dgitalfactory.usersecurity.email.exception.EmailExecption;
import com.dgitalfactory.usersecurity.exception.*;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import org.hibernate.exception.SQLGrammarException;
import org.modelmapper.MappingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.NoSuchMessageException;
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
import org.thymeleaf.exceptions.TemplateProcessingException;

import java.io.IOException;
import java.net.UnknownHostException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@RestControllerAdvice
public class AdviceControllerExceptionHandler {

//    @Autowired
//    private ResponseStatusMessages msgSource;

    @Autowired
    private UtilsCommons utilsCommons;

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
        Locale locale = request.getLocale();
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(4011)
                .message(utilsCommons.getStatusMessage(4011, locale))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=", ""))
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
                .message(utilsCommons.getStatusMessage(4028, request.getLocale()))
//                .message(UtilsCommons.getResponseConstants(4028))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=", ""))
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
                .message(utilsCommons.getStatusMessage(4027, request.getLocale()))
//                .message(UtilsCommons.getResponseConstants(4027))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=", ""))
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
                .message(utilsCommons.getStatusMessage(4026, request.getLocale()))
//                .message(UtilsCommons.getResponseConstants(4026))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=", ""))
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
    public ResponseEntity<ErrorDTO> getGlobalErrorHandler(GlobalAppException ex, WebRequest request) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(ex.getCode())
                .message(utilsCommons.getStatusMessage(ex.getCode(), request.getLocale()))
//                .message(UtilsCommons.getResponseConstants(ex.getCode()))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .details(ex.getDetails())
                .path(request.getDescription(false).replace("uri=", ""))
                .build();
        return new ResponseEntity<>(errorDTO, ex.getStatus());
    }

    /**
     * Constructor de errores JWT
     *
     * @param ex: tipo JWTAppException(HttpStatus status, String message, String code)
     * @return: @{@link ResponseEntity<ErrorDTO>}
     */
    @ExceptionHandler(value = JWTAppException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ErrorDTO> getJWTErrorHandler(JWTAppException ex, WebRequest request) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(ex.getCode())
                .message(utilsCommons.getStatusMessage(ex.getCode(), request.getLocale()))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .details(ex.getDetails())
                .build();
        return new ResponseEntity<>(errorDTO, ex.getStatus());
    }

    /**
     * Constructor generico para errores pero con mensaje formateado desde el método
     *
     * @param ex: tipo GlobalAppException(HttpStatus status, String message, String code)
     * @return: ResponseEntity<ErrorDTO>
     */
    @ExceptionHandler(value = GlobalMessageException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ErrorDTO> getGlobalMessageErrorHandler(GlobalMessageException ex, WebRequest request) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(ex.getCode())
                .message(ex.getMessage())
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .details(ex.getDetails())
                .path(request.getDescription(false).replace("uri=", ""))
                .build();
        return new ResponseEntity<>(errorDTO, ex.getStatus());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    protected ResponseEntity<Object> getHandleMethodArgumentNotValid(MethodArgumentNotValidException ex, WebRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String nameFild = ((FieldError) error).getField();
            String message = error.getDefaultMessage();
            errors.put(nameFild, message);
        });
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(4012)
                .message(utilsCommons.getStatusMessage(4012, request.getLocale()))
                .listDetails(errors)
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=", ""))
                .build();
        return new ResponseEntity<>(errorDTO, HttpStatus.BAD_REQUEST);
    }


    /**
     * ERROR CUANDO EL USUARIO ESTA BLOQUEADO PRO EL @{@link com.dgitalfactory.usersecurity.security.configuration.CustomAuthenticationProvider}
     *
     * @param ex: type {@link LockedException}
     * @return
     */
    @ExceptionHandler(LockedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    protected ResponseEntity<Object> getLockedException(LockedException ex, WebRequest request) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(4017)
                .message(utilsCommons.getStatusMessage(4017, request.getLocale()))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=", ""))
                .details(ex.getMessage())
                .build();
        return new ResponseEntity<>(errorDTO, HttpStatus.UNAUTHORIZED);
    }

    /**
     * ERROR QUE PRODUCE AL CONSULTAR EN LA BASE DE DATOS POR QUERY
     *
     * @param ex
     * @return
     */
    @ExceptionHandler(InvalidDataAccessApiUsageException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    protected ResponseEntity<Object> getInvalidDataAccessApiUsageException(InvalidDataAccessApiUsageException ex, WebRequest request) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(5001)
                .message(utilsCommons.getStatusMessage(5001, request.getLocale()))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=", ""))
                .details(ex.getMessage())
                .build();
        return new ResponseEntity<>(errorDTO, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * ERROR QUE PRODUCE EL @{@link com.dgitalfactory.usersecurity.security.configuration.CustomAuthenticationProvider}
     *
     * @param error
     * @return
     */
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    protected ResponseEntity<Object> getAccessDeniedErrorException(AccessDeniedException error, WebRequest request) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(403)
                .message(utilsCommons.getStatusMessage(403, request.getLocale()))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=", ""))
                .details("Puede que tu el alcance de tu rol no te de acceso a este recurso. Intenta iniciar sesión nuevamente e intentalo de nuevo, de lo contrario comunicate con tu administrador")
                .build();
        return new ResponseEntity<>(errorDTO, HttpStatus.FORBIDDEN);
    }

    /**
     * ERROR QUE PRODUCE EL @{@link com.dgitalfactory.usersecurity.security.configuration.CustomAuthenticationProvider}
     *
     * @param error
     * @return
     */
    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    protected ResponseEntity<Object> getBadCredentialsException(BadCredentialsException error, WebRequest request) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(4016)
                .message(utilsCommons.getStatusMessage(4016, request.getLocale()))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=", ""))
                .details(error.getMessage())
                .build();
        return new ResponseEntity<>(errorDTO, HttpStatus.BAD_REQUEST);
    }

    /**
     * Error general @{@link IOException}
     *
     * @param ex
     * @param request
     * @return
     */
    @ExceptionHandler(IOException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<Object> getHandleIOException(IOException ex, WebRequest request) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(995)
                .message(utilsCommons.getStatusMessage(995, request.getLocale()))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=", ""))
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
                .message(utilsCommons.getStatusMessage(4003, request.getLocale()))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=", ""))
                .details(ex.getMessage())
                .build();
        return new ResponseEntity<>(errorDTO, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(EmailExecption.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    protected ResponseEntity<Object> getEmailException(EmailExecption ex, WebRequest request) {
//    MailPreparationException- en caso de fallo al preparar un mensaje
//    MailParseException- en caso de fallo al analizar un mensaje
//    MailAuthenticationException- en caso de fallo de autenticación
//    MailSendException- en caso de fallo al enviar un mensaje
//    MailException
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(4003)
                .message(utilsCommons.getStatusMessage(4003, request.getLocale()))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=", ""))
                .details(ex.getMessage())
                .build();
        return new ResponseEntity<>(errorDTO, HttpStatus.INTERNAL_SERVER_ERROR);
    }


    /**
     * Cach error for message sourse file messagess.properties
     * @param ex
     * @param request
     * @return
     */
    @ExceptionHandler(NoSuchMessageException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<ErrorDTO> getNoSuchMessageErrorException(NoSuchMessageException ex, WebRequest request) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(999)
                .message(utilsCommons.getStatusMessage(999,request.getLocale()))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .details(ex.getMessage())
                .path(request.getDescription(false).replace("uri=", ""))
                .build();
        return new ResponseEntity<>(errorDTO, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Error al crear template con thymeleaf
     * @param ex
     * @param request
     * @return
     */
        @ExceptionHandler(TemplateProcessingException.class)
        @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
        public ResponseEntity<ErrorDTO> getTemplateProcessingErrorException(TemplateProcessingException ex, WebRequest request) {
            ErrorDTO errorDTO = ErrorDTO.builder()
                    .code(4032)
                    .message(utilsCommons.getStatusMessage(4032))
                    .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                    .details(ex.getMessage())
                    .path(request.getDescription(false).replace("uri=", ""))
                    .build();
            return new ResponseEntity<>(errorDTO, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    @ExceptionHandler(ExplicitErrorAppException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ErrorDTO> getExplicitErrorException(ExplicitErrorAppException ex, WebRequest request) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(ex.getCode())
                .message(ex.getMessage())
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .details(ex.getDetails())
                .path(request.getDescription(false).replace("uri=", ""))
                .build();
        return new ResponseEntity<>(errorDTO, ex.getStatus());
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
                .message(utilsCommons.getStatusMessage(998, request.getLocale()))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=", ""))
                .details(ex.getMessage())
                .build();
        return new ResponseEntity<>(errorDTO, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<ErrorDTO> getGlobalException(Exception ex, WebRequest request) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(997)
                .message(utilsCommons.getStatusMessage(997, request.getLocale()))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=", ""))
                .details(ex.getMessage())
                .build();
        return new ResponseEntity<>(errorDTO, HttpStatus.INTERNAL_SERVER_ERROR);
    }


    @ExceptionHandler(SQLGrammarException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<ErrorDTO> getSqlExceptionHelper(SQLGrammarException ex, WebRequest request) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .code(994)
                .message(utilsCommons.getStatusMessage(994, request.getLocale()))
                .date(UtilsCommons.convertLocalDateTimeToString(LocalDateTime.now()))
                .path(request.getDescription(false).replace("uri=", ""))
                .details(ex.getMessage())
                .build();
        return new ResponseEntity<>(errorDTO, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
