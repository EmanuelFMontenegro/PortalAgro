package com.dgitalfactory.usersecurity.controller.service_app;

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
@Tag(name = "Type of Services", description = "Services.")
public class TypeServiceController {

    @Autowired
    private TypeSvcService typeServiceSVR;

    @Autowired
    private UtilsCommons utilsCommons;

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/user/field/service/type")
    public ResponseEntity<List<TypeServiceDTO>> getAllServiceType(){
        return new ResponseEntity<List<TypeServiceDTO>>(
                this.typeServiceSVR.getAllTypeServiceDTO(), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/user/field/service/type")
    public ResponseEntity<MessageDTO> addServiceType(@RequestBody @Valid TypeServiceResponseDTO typeServiceResponseDTO){
        this.typeServiceSVR.addTypeService(typeServiceResponseDTO);
        return new ResponseEntity<MessageDTO>(
                MessageDTO.builder()
                        .code(2001)
                        .message(utilsCommons.getStatusMessage(2001))
                        .details(utilsCommons.getMessage("field.name.service.type"))
                        .build()
                , HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/user/field/service/type/{typeService_id}")
    public ResponseEntity<MessageDTO> updateServiceType(@PathVariable("typeService_id") Long typeService_id,
                                                     @RequestBody @Valid TypeServiceResponseDTO typeServiceResponseDTO){
        this.typeServiceSVR.updateTypeService(typeService_id,typeServiceResponseDTO);
        return new ResponseEntity<MessageDTO>(
                MessageDTO.builder()
                        .code(2002)
                        .message(utilsCommons.getStatusMessage(2002))
                        .details(utilsCommons.getMessage("field.name.service.type"))
                        .build()
                , HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/user/field/service/type/{typeService_id}")
    public ResponseEntity<MessageDTO> deleteServiceType(@PathVariable("typeService_id") Long typeService_id){
        this.typeServiceSVR.updateTypeService(typeService_id);
        return new ResponseEntity<MessageDTO>(
                MessageDTO.builder()
                        .code(2003)
                        .message(utilsCommons.getStatusMessage(2003))
                        .details(utilsCommons.getMessage("field.name.service.type"))
                        .build()
                , HttpStatus.OK);
    }


}
