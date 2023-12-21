package com.dgitalfactory.usersecurity.controller.service_app;

import com.dgitalfactory.usersecurity.DTO.AppService.ServiceAppDTO;
import com.dgitalfactory.usersecurity.DTO.AppService.ServiceAppResponseDTO;
import com.dgitalfactory.usersecurity.DTO.AppService.TypeServiceDTO;
import com.dgitalfactory.usersecurity.DTO.AppService.TypeServiceResponseDTO;
import com.dgitalfactory.usersecurity.DTO.MessageDTO;
import com.dgitalfactory.usersecurity.DTO.ResponsePaginationDTO;
import com.dgitalfactory.usersecurity.service.ServiceAppService;
import com.dgitalfactory.usersecurity.service.TypeSvcService;
import com.dgitalfactory.usersecurity.utils.AppConstants;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 19/12/2023 - 10:34
 */
@RestController
@RequestMapping("/api")
@CrossOrigin
@Validated
@Tag(name = "Services", description = "Services.")
public class ServiceAppController {

    @Autowired
    private ServiceAppService serviceAppSVR;

    @Autowired
    private UtilsCommons utilsCommons;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/user/field/service")
    public ResponseEntity<ResponsePaginationDTO> getAllServiceAppUsers(
            @RequestParam(value = "pageNo", defaultValue = AppConstants.PAGE_NUMBER_DEFAULT, required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = AppConstants.PAGE_SIZE_DEFAULT, required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = AppConstants.ORDER_BY_DEFAULT, required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = AppConstants.ORDER_DIR_DEFAULT, required = false) String sortDir) {

        return new ResponseEntity<ResponsePaginationDTO>(
                this.serviceAppSVR.getAllServiceUsers(pageNumber, pageSize, sortBy, sortDir), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') or @conditionEvaluatorService.canPreAuthAdmin(#user_id)")
    @PostMapping("/user/{user_id}/field/{field_id}/service")
    public ResponseEntity<MessageDTO> addServiceApp(@PathVariable("user_id") Long user_id,
                                                     @PathVariable("field_id") Long field_id,
                                                     @RequestBody @Valid ServiceAppResponseDTO serviceResponseDTO) {
        this.serviceAppSVR.addServiceApp(field_id, serviceResponseDTO);
        return new ResponseEntity<MessageDTO>(
                MessageDTO.builder()
                        .code(2001)
                        .message(utilsCommons.getStatusMessage(2001))
                        .details(utilsCommons.getMessage("field.name.service.order"))
                        .build()
                , HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') or @conditionEvaluatorService.canPreAuthAdmin(#user_id)")
    @PostMapping("/user/{user_id}/field/{field_id}/service/{service_id}")
    public ResponseEntity<ServiceAppDTO> getServiceById(@PathVariable("user_id") Long user_id,
                                                     @PathVariable("field_id") Long field_id,
                                                     @PathVariable("service_id") Long service_id) {
        return new ResponseEntity<ServiceAppDTO>(
                this.serviceAppSVR.getServiceAppDTO(field_id, service_id),
                HttpStatus.OK);
    }
}
