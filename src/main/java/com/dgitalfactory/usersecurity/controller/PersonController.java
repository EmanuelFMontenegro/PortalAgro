package com.dgitalfactory.usersecurity.controller;

import com.dgitalfactory.usersecurity.DTO.MessageDTO;
import com.dgitalfactory.usersecurity.DTO.PersonDTO;
import com.dgitalfactory.usersecurity.DTO.PersonResponseDTO;
import com.dgitalfactory.usersecurity.service.PersonService;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<PersonDTO> getPersonById(@PathVariable("id") Long id){
        PersonDTO personDTO = this.personSVC.getPersonDtoById(id);
        return ResponseEntity.ok(personDTO);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("")
    public ResponseEntity<List<PersonDTO>> getPeople(){
        List<PersonDTO> listPersonDTO = this.personSVC.getPeopleDTO();
        return ResponseEntity.ok(listPersonDTO);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{userid}")
    public ResponseEntity<MessageDTO> addPerson(@PathVariable Long userid, @RequestBody @Valid PersonResponseDTO personResponseDTO){
        this.personSVC.addPerson(userid,personResponseDTO);
        return ResponseEntity.ok(
                MessageDTO.builder().code(2001).message(UtilsCommons.getResponseConstants(2001)).build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{userid}")
    public ResponseEntity<MessageDTO> updatePerson(@PathVariable Long userid, @RequestBody @Valid PersonDTO personDTO){
        PersonDTO newPersonDTO = this.personSVC.updatePerson(userid,personDTO);
        return ResponseEntity.ok(
                MessageDTO.builder().code(2002).message(UtilsCommons.getResponseConstants(2002)).build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageDTO> deletePersonById(@PathVariable("id") Long id){
        this.personSVC.deletePersonById(id);
        return ResponseEntity.ok(MessageDTO.builder().code(2003).message(UtilsCommons.getResponseConstants(2003)).build());
    }


}
