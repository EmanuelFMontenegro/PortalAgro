package com.dgitalfactory.usersecurity.controller.Fields;

import com.dgitalfactory.usersecurity.DTO.MessageDTO;
import com.dgitalfactory.usersecurity.DTO.TypePlantation.TypePlantationRequestDTO;
import com.dgitalfactory.usersecurity.DTO.TypePlantation.TypePlantationResponseDTO;
import com.dgitalfactory.usersecurity.service.FieldRelated.TypePlantationService;
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
@RequestMapping("/api/field/plantation")
@CrossOrigin
@Validated
@Tag(name = "Type of Plantation", description = "Administration the Types of Plantations.")
public class TypePlantationController {

    @Autowired
    private TypePlantationService typePlantationSVR;

    @Autowired
    private UtilsCommons utilsCommons;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<TypePlantationRequestDTO>> getAllServiceType(
            @RequestParam(value = "isActive", defaultValue = "",required = false) String active
    ){
        return new ResponseEntity<List<TypePlantationRequestDTO>>(
                this.typePlantationSVR.getAllTypePlantation(active), HttpStatus.OK);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/type")
    public ResponseEntity<List<TypePlantationRequestDTO>> getAllActivePlantationsType(){
        return new ResponseEntity<List<TypePlantationRequestDTO>>(
                this.typePlantationSVR.getTypePlantationsActive(true), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/type")
    public ResponseEntity<MessageDTO> addTypePlantation(@RequestBody @Valid TypePlantationResponseDTO typeServiceResponseDTO){
        this.typePlantationSVR.addTypePlantation(typeServiceResponseDTO);
        return new ResponseEntity<MessageDTO>(
                MessageDTO.builder()
                        .code(2001)
                        .message(utilsCommons.getStatusMessage(2001))
                        .details(utilsCommons.getMessage("field.name.field.typeplantation"))
                        .build()
                , HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/type/{typePlantation_id}")
    public ResponseEntity<MessageDTO> updateTypePlantation(@PathVariable("typePlantation_id") Long typePlantation_id,
                                                     @RequestBody @Valid TypePlantationResponseDTO typeServiceResponseDTO){
        this.typePlantationSVR.updateTypePlantation(typePlantation_id,typeServiceResponseDTO);
        return new ResponseEntity<MessageDTO>(
                MessageDTO.builder()
                        .code(2002)
                        .message(utilsCommons.getStatusMessage(2002))
                        .details(utilsCommons.getMessage("field.name.field.typeplantation"))
                        .build()
                , HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/type/{typePlantation_id}")
    public ResponseEntity<MessageDTO> deleteTypePlantation(@PathVariable("typePlantation_id") Long typePlantation_id){
        this.typePlantationSVR.deleteTypePlantationLogical(typePlantation_id);
        return new ResponseEntity<MessageDTO>(
                MessageDTO.builder()
                        .code(2003)
                        .message(utilsCommons.getStatusMessage(2003))
                        .details(utilsCommons.getMessage("field.name.field.typeplantation"))
                        .build()
                , HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/type/{typePlantation_id}/active")
    public ResponseEntity<MessageDTO> activeTypePlantation(@PathVariable("typePlantation_id") Long typePlantation_id){
        this.typePlantationSVR.activeTypePlantationLogical(typePlantation_id);
        return new ResponseEntity<MessageDTO>(
                MessageDTO.builder()
                        .code(2009)
                        .message(utilsCommons.getStatusMessage(2009))
                        .details(utilsCommons.getMessage("field.name.field.typeplantation"))
                        .build()
                , HttpStatus.OK);
    }

}
