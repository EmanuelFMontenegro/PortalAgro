package com.dgitalfactory.usersecurity.controller;

import com.dgitalfactory.usersecurity.DTO.MessageDTO;
import com.dgitalfactory.usersecurity.DTO.PersonDTO;
import com.dgitalfactory.usersecurity.service.PersonService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/person")
@CrossOrigin
public class PersonController {

    @Autowired
    private PersonService personSVC;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<PersonDTO> getPersonById(@PathVariable("id") Long id){
        PersonDTO personDTO = this.personSVC.getPersonById(id);
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
    public ResponseEntity<MessageDTO> addPerson(@PathVariable Long userid, @RequestBody @Valid PersonDTO personDTO){
        PersonDTO newPersonDTO = this.personSVC.addPerson(userid,personDTO);
        return ResponseEntity.ok(
                MessageDTO.builder().code(HttpStatus.CREATED.toString()).message("Registered person").build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{userid}")
    public ResponseEntity<MessageDTO> updatePerson(@PathVariable Long userid, @RequestBody @Valid PersonDTO personDTO){
        PersonDTO newPersonDTO = this.personSVC.updatePerson(userid,personDTO);
        return ResponseEntity.ok(
                MessageDTO.builder().code(HttpStatus.OK.toString()).message("Update person").build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageDTO> deletePersonById(@PathVariable("id") Long id){
        this.personSVC.deletePersonById(id);
        return ResponseEntity.ok(MessageDTO.builder().code(HttpStatus.OK.toString()).message("Person delete").build());
    }


}
