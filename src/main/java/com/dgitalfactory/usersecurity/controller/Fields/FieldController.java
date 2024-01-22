package com.dgitalfactory.usersecurity.controller.Fields;

import com.dgitalfactory.usersecurity.DTO.*;
import com.dgitalfactory.usersecurity.DTO.Field.FieldDTO;
import com.dgitalfactory.usersecurity.DTO.Field.FieldResponseDTO;
import com.dgitalfactory.usersecurity.DTO.Field.GeolocationDTO;
import com.dgitalfactory.usersecurity.service.FieldRelated.FieldService;
import com.dgitalfactory.usersecurity.utils.AppConstants;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Validated
@RestController
@RequestMapping("/api")
@CrossOrigin
@Tag(name = "Fields", description = "Fields Services.")
public class FieldController {

    @Autowired
    private FieldService fieldSVC;

    @Autowired
    private UtilsCommons utilsCommons;

    @PreAuthorize("isAuthenticated()")
    @GetMapping("hola/demo")
    public ResponseEntity<MessageDTO> getDemo(HttpServletRequest request) {
        return ResponseEntity.ok(MessageDTO.builder()
                .code(1001)
                .message(utilsCommons.getStatusMessage(1001))
                .build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/user/field/")
    public ResponseEntity<?> getAllFieldsUsers(
            @RequestParam(value = "pageNo", defaultValue = AppConstants.PAGE_NUMBER_DEFAULT, required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = AppConstants.PAGE_SIZE_DEFAULT, required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = AppConstants.ORDER_BY_DEFAULT, required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = AppConstants.ORDER_DIR_DEFAULT, required = false) String sortDir,
            @RequestParam(value = "isActive", defaultValue = "", required = false) String active

    ) {
        return new ResponseEntity<ResponsePaginationDTO<Object>>(
                this.fieldSVC.getAllFieldsUsersByActive(pageNumber, pageSize, sortBy, sortDir, active), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') or @conditionEvaluatorService.canPreAuthAdmin(#user_id)")
    @GetMapping("/user/{user_id}/field/{field_id}")
    public ResponseEntity<FieldDTO> getFieldById(@PathVariable("user_id") Long user_id, @PathVariable("field_id") Long field_id) {
        FieldDTO fieldDTO = this.fieldSVC.getFielDTOdById(field_id);
        return ResponseEntity.ok(fieldDTO);
    }

    @PreAuthorize("hasRole('ADMIN') or @conditionEvaluatorService.canPreAuthAdmin(#user_id)")
    @GetMapping("/user/{user_id}/field")
    public ResponseEntity<?> getFieldById(
            @RequestParam(value = "pageNo", defaultValue = AppConstants.PAGE_NUMBER_DEFAULT, required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = AppConstants.PAGE_SIZE_DEFAULT, required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = AppConstants.ORDER_BY_DEFAULT, required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = AppConstants.ORDER_DIR_DEFAULT, required = false) String sortDir,
            @PathVariable("user_id") Long user_id) {
        ResponsePaginationDTO<Object> listFieldDTO = this.fieldSVC.getAllFieldDTOdsByUserId(pageNumber, pageSize, sortBy, sortDir,
                user_id);
        return ResponseEntity.ok(listFieldDTO);
    }


    @PreAuthorize("hasRole('ADMIN') or @conditionEvaluatorService.canPreAuthAdmin(#user_id)")
    @PostMapping("/user/{user_id}/field")
    public ResponseEntity<MessageDTO> addField(@PathVariable("user_id") Long user_id,
                                               @Valid @RequestBody FieldResponseDTO field) {
        this.fieldSVC.addField(user_id, field);
        return ResponseEntity.ok(
                MessageDTO.builder().code(2001)
                        .message(utilsCommons.getStatusMessage(2001))
                        .details(utilsCommons.getMessage("field.name.field"))
                        .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN') or @conditionEvaluatorService.canPreAuthAdmin(#user_id)")
    @PutMapping("/user/{user_id}/field/{field_id}")
    public ResponseEntity<MessageDTO> updateField(@PathVariable("user_id") Long user_id, @PathVariable("field_id") Long field_id, @RequestBody @Valid FieldResponseDTO fieldResponseDTO) {
        FieldDTO newFieldDTO = this.fieldSVC.updateField(user_id, field_id, fieldResponseDTO);
        return ResponseEntity.ok(
                MessageDTO.builder().code(2002).message(utilsCommons.getStatusMessage(2002))
                        .details(utilsCommons.getMessage("field.name.field"))
                        .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/user/{user_id}/field/{field_id}/admin")
    public ResponseEntity<MessageDTO> deleteDefinitiveField(@PathVariable("user_id") Long user_id, @PathVariable("field_id") Long field_id) {
        this.fieldSVC.deleteFieldById(field_id, user_id);
        return new ResponseEntity<>(MessageDTO.builder().code(2003).message(utilsCommons.getStatusMessage(2003))
                .details(utilsCommons.getMessage("field.name.field"))
                .build(), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') or @conditionEvaluatorService.canPreAuthAdmin(#user_id)")
    @DeleteMapping("/user/{user_id}/field/{field_id}")
    public ResponseEntity<MessageDTO> deleteLogicalField(
            @PathVariable("user_id") Long user_id,
            @PathVariable("field_id") Long field_id) {
        this.fieldSVC.deleteLogicalFieldById(field_id, user_id,false);
        return new ResponseEntity<>(MessageDTO.builder().code(2003).message(utilsCommons.getStatusMessage(2003))
                .details(utilsCommons.getMessage("field.name.field"))
                .build(), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') or @conditionEvaluatorService.canPreAuthAdmin(#user_id)")
    @PutMapping("/user/{user_id}/field/{field_id}/active")
    public ResponseEntity<MessageDTO> activeLogicalField(
            @PathVariable("user_id") Long user_id,
            @PathVariable("field_id") Long field_id) {
        this.fieldSVC.deleteLogicalFieldById(field_id, user_id,true);
        return new ResponseEntity<>(MessageDTO.builder().code(2009).message(utilsCommons.getStatusMessage(2009))
                .details(utilsCommons.getMessage("field.name.field"))
                .build(), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') or @conditionEvaluatorService.canPreAuthAdmin(#user_id)")
    @GetMapping("/user/{user_id}/field/{field_id}/geolocation")
    public ResponseEntity<GeolocationDTO> getGeolocation(@PathVariable("user_id") Long user_id,
                                                         @PathVariable("field_id") Long field_id) {
        GeolocationDTO geolocationDTO = this.fieldSVC.getGeolocationDTOByFieldId(field_id);
        return ResponseEntity.ok(geolocationDTO);
    }

    @PreAuthorize("hasRole('ADMIN') or @conditionEvaluatorService.canPreAuthAdmin(#user_id)")
    @PutMapping("/user/{user_id}/field/{field_id}/geolocation")
    public ResponseEntity<MessageDTO> updateGeolocation(@PathVariable("user_id") Long user_id,
                                                        @PathVariable("field_id") Long field_id,
                                                        @Valid @RequestBody GeolocationDTO geolocationDTO) {
        this.fieldSVC.updateGeolocationDTOByFieldId(field_id, geolocationDTO);
        return new ResponseEntity<>(MessageDTO.builder().code(2002).message(utilsCommons.getStatusMessage(2002))
                .details(utilsCommons.getMessage("field.name.field.geolocation"))
                .build(), HttpStatus.OK);
    }

//    @PreAuthorize("hasRole('ADMIN') or @conditionEvaluatorService.canPreAuthAdmin(#user_id)")
//    @PostMapping("/user/{user_id}/field/{field_id}/geolocation")
//    public ResponseEntity<MessageDTO> addGeolocation(@PathVariable("user_id") Long user_id,
//                                                                     @PathVariable("field_id") Long field_id,
//                                                                     @Valid @RequestBody GeolocationDTO geolocationDTO){
//        this.fieldSVC.updateGeolocationDTOByFieldId(field_id, geolocationDTO);
//        return new ResponseEntity<>(MessageDTO.builder().code(2002).message(UtilsCommons.getResponseConstants(2002))
//                .details("Geolocalización")
//                .build(), HttpStatus.OK);
//    }

}
