package com.dgitalfactory.usersecurity.controller;

import com.dgitalfactory.usersecurity.DTO.MessageDTO;
import com.dgitalfactory.usersecurity.DTO.Person.PersonResponseDTO;
import com.dgitalfactory.usersecurity.DTO.Person.PersonRequestDTO;
import com.dgitalfactory.usersecurity.DTO.ResponsePaginationDTO;
import com.dgitalfactory.usersecurity.service.PersonService;
import com.dgitalfactory.usersecurity.utils.AppConstants;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@RestController
@RequestMapping("/api")
@CrossOrigin
@Validated
@Tag(name = "Person", description = "Person Services. Additional user information.")
public class PersonController {

    @Autowired
    private PersonService personSVC;

    @Autowired
    private UtilsCommons utilsCommons;

    @PreAuthorize("hasRole('ADMIN') or @conditionEvaluatorService.canPreAuthAdmin(#user_id)")
    @GetMapping("/user/{user_id}/person/{person_id}")
    public ResponseEntity<PersonResponseDTO> getPersonById(@PathVariable("user_id") Long user_id, @PathVariable("person_id") Long person_id) {
        PersonResponseDTO personResponseDTO = this.personSVC.getPersonDtoById(user_id, person_id);
        return ResponseEntity.ok(personResponseDTO);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/user/person/{dniCuit}")
    public ResponseEntity<PersonResponseDTO> getPersonByDniCuit(
            @PathVariable("dniCuit") String dniCuit) {
        return ResponseEntity.ok(this.personSVC.getPersonDTOByDniCuit(dniCuit));
    }

    @PreAuthorize("isAuthenticated")
    @GetMapping("/user/person")
    public ResponseEntity<MessageDTO> existPersonByDniCuit(
            @RequestParam(value = "dniCuit", required = false) String dniCuit) {
        if(this.personSVC.existPersonByDniCuit(dniCuit)) {
            return ResponseEntity.ok(MessageDTO.builder()
                    .code(2008)
                    .message(utilsCommons.getFormatMessage(
                            utilsCommons.getStatusMessage(2008),
                            utilsCommons.getMessage("field.name.person"),
                            utilsCommons.getMessage("field.name.dnicuil"))
                    )
                    .details(utilsCommons.getMessage("field.name.person"))
                    .build());
        }else{
            return ResponseEntity.ok(MessageDTO.builder()
                    .code(4033)
                    .message(utilsCommons.getFormatMessage(
                            utilsCommons.getStatusMessage(4033),
                            utilsCommons.getMessage("field.name.person"),
                            utilsCommons.getMessage("field.name.dnicuil"))
                    )
                    .details(utilsCommons.getMessage("field.name.person"))
                    .build());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/person")
    public ResponseEntity<?> getPeople(
            @RequestParam(value = "pageNo", defaultValue = AppConstants.PAGE_NUMBER_DEFAULT, required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = AppConstants.PAGE_SIZE_DEFAULT, required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = AppConstants.ORDER_BY_DEFAULT, required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = AppConstants.ORDER_DIR_DEFAULT, required = false) String sortDir
    ) {
        if (!sortDir.isEmpty()) {
            if (!sortDir.equalsIgnoreCase("asc") && !sortDir.equalsIgnoreCase("desc")) {
                return ResponseEntity.badRequest().body(
                        MessageDTO.builder()
                                .code(4035)
                                .message(utilsCommons.getStatusMessage(4035))
                                .details(utilsCommons.getMessage("field.name.location"))
                                .build()
                );
            }
        }
        ResponsePaginationDTO<Object> listPersonDTO = this.personSVC.getPeoplePagination(pageNumber, pageSize, sortBy, sortDir);
        return ResponseEntity.ok(listPersonDTO);
    }

//    @PreAuthorize("hasRole('ADMIN') or @conditionEvaluatorService.canPreAuthAdmin(#user_id)")
//    @PostMapping("/{user_id}")
//    public ResponseEntity<MessageDTO> addPerson(@PathVariable Long user_id, @RequestBody @Valid PersonRequestDTO personRequestDTO) {
//        this.personSVC.addPerson(user_id, personRequestDTO);
//        return ResponseEntity.ok(
//                MessageDTO.builder()
//                        .code(2001)
//                        .message(utilsCommons.getStatusMessage(2001))
//                        .details("Person")
//                        .build()
//        );
//    }

    @PreAuthorize("hasRole('ADMIN') or @conditionEvaluatorService.canPreAuthAdmin(#user_id)")
    @PutMapping("/user/{user_id}/person/{person_id}")
    public ResponseEntity<MessageDTO> updatePersonById(
            @PathVariable("user_id") Long user_id,
            @PathVariable("person_id") Long person_id,
            @RequestBody @Valid PersonRequestDTO personDTO) {
        this.personSVC.updatePerson(user_id, person_id, personDTO);
        return ResponseEntity.ok(
                MessageDTO.builder()
                        .code(2002)
                        .message(utilsCommons.getStatusMessage(2002))
                        .details(utilsCommons.getMessage("field.name.person"))
                        .build()
        );
    }

//    @PreAuthorize("hasRole('ADMIN')")
//    @DeleteMapping("/{id}")
//    public ResponseEntity<MessageDTO> deletePersonById(@PathVariable("id") Long id) {
//        this.personSVC.deletePersonById(id);
//        return ResponseEntity.ok(MessageDTO.builder()
//                .code(2003)
//                .message(utilsCommons.getStatusMessage(2003))
//                .details(utilsCommons.getMessage("field.name.person"))
//                .build());
//    }


}
