package com.dgitalfactory.usersecurity.controller;

import com.dgitalfactory.usersecurity.DTO.MessageDTO;
import com.dgitalfactory.usersecurity.DTO.Person.PersonDTO;
import com.dgitalfactory.usersecurity.DTO.Person.PersonResponseDTO;
import com.dgitalfactory.usersecurity.DTO.ResponsePaginationDTO;
import com.dgitalfactory.usersecurity.service.PersonService;
import com.dgitalfactory.usersecurity.utils.AppConstants;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@RestController
@RequestMapping("/api/person")
@CrossOrigin
@Tag(name = "Person", description = "Person Services. Additional user information.")
public class PersonController {

    @Autowired
    private PersonService personSVC;

    @Autowired
    private UtilsCommons utilsCommons;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/demo")
    public ResponseEntity<MessageDTO> getDemo(HttpServletRequest request) {
        return ResponseEntity.ok(MessageDTO.builder()
                .code(1001)
                .message(utilsCommons.getStatusMessage(1001))
                .build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<PersonDTO> getPersonById(@PathVariable("id") Long id) {
        PersonDTO personDTO = this.personSVC.getPersonDtoById(id);
        return ResponseEntity.ok(personDTO);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("")
    public ResponseEntity<ResponsePaginationDTO> getPeople(
            @RequestParam(value = "pageNo", defaultValue = AppConstants.PAGE_NUMBER_DEFAULT, required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = AppConstants.PAGE_SIZE_DEFAULT, required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = AppConstants.ORDER_BY_DEFAULT, required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = AppConstants.ORDER_DIR_DEFAULT, required = false) String sortDir
    ) {
        ResponsePaginationDTO listPersonDTO = this.personSVC.getPeoplePagination(pageNumber, pageSize, sortBy, sortDir);
        return ResponseEntity.ok(listPersonDTO);
    }

    @PreAuthorize("hasRole('ADMIN') or @conditionEvaluatorService.canPreAuthAdmin(#user_id)")
    @PostMapping("/{userid}")
    public ResponseEntity<MessageDTO> addPerson(@PathVariable Long user_id, @RequestBody @Valid PersonResponseDTO personResponseDTO) {
        this.personSVC.addPerson(user_id, personResponseDTO);
        return ResponseEntity.ok(
                MessageDTO.builder()
                        .code(2001)
                        .message(utilsCommons.getStatusMessage(2001))
                        .details("Person")
                        .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN') or @conditionEvaluatorService.canPreAuthAdmin(#user_id)")
    @PutMapping("/{userid}")
    public ResponseEntity<MessageDTO> updatePerson(@PathVariable Long user_id, @RequestBody @Valid PersonDTO personDTO) {
        PersonDTO newPersonDTO = this.personSVC.updatePerson(user_id, personDTO);
        return ResponseEntity.ok(
                MessageDTO.builder()
                        .code(2002)
                        .message(utilsCommons.getStatusMessage(2002))
                        .details("Person")
                        .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageDTO> deletePersonById(@PathVariable("id") Long id) {
        this.personSVC.deletePersonById(id);
        return ResponseEntity.ok(MessageDTO.builder()
                .code(2003)
                .message(utilsCommons.getStatusMessage(2003))
                .details("Person")
                .build());
    }


}
