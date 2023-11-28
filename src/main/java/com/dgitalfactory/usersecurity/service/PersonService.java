package com.dgitalfactory.usersecurity.service;

import com.dgitalfactory.usersecurity.DTO.PersonDTO;
import com.dgitalfactory.usersecurity.entity.Person;
import com.dgitalfactory.usersecurity.exception.GlobalAppException;
import com.dgitalfactory.usersecurity.exception.ResourceNotFoundException;
import com.dgitalfactory.usersecurity.repository.PersonRepository;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PersonService {
    private static final Logger log = LoggerFactory.getLogger(PersonService.class);

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private PersonRepository personRepo;

    @Autowired
    private UtilsCommons utilsComm;

    /**
     * Return Information Person
     *
     * @param id
     * @return
     */
    public PersonDTO getPersonById(Long id){
        Person person =this.personRepo.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Person","id",id));
        return this.convertEntityToDTO(person);
    }

    public PersonDTO getPersonDTOByDni(String dni){
        Person person =this.personRepo.findByDni(dni)
                .orElseThrow(()-> new ResourceNotFoundException("Person","DNI",dni));
        return this.convertEntityToDTO(person);
    }

    public Person getPersonByDni(String dni){
        Person person =this.personRepo.findByDni(dni)
                .orElseThrow(()-> new ResourceNotFoundException("Person","DNI",dni));
        return person;
    }

    public List<PersonDTO> getPeopleDTO(){
        List<PersonDTO> peopleDTO = this.personRepo.findAll().stream().map(
                person -> this.convertEntityToDTO(person)
        ).toList();
        return peopleDTO;
    }


    @Transactional(propagation = Propagation.SUPPORTS)
    public PersonDTO addPerson(Long userid, PersonDTO personDTO){
        //validar datos
        if(this.personRepo.existsByUserid(userid)){
            throw new GlobalAppException(HttpStatus.BAD_REQUEST, "The user ID has a person entity","dic code..");
        }
        this.validatePerson(personDTO);

        Person person = this.convertDTOToEntity(personDTO);
        person.setUserid(userid);
        this.personRepo.save(person);
        PersonDTO newPersonDTO = this.getPersonDTOByDni(personDTO.getDni());
        log.info("New person: ", newPersonDTO);
        return newPersonDTO;
    }

//    @Transactional(propagation = Propagation.SUPPORTS)
    public PersonDTO updatePerson(Long userid, PersonDTO personDTO){
        //validar datos
        this.validatePerson(personDTO);
        Person person = this.personRepo.findByUserid(userid).orElseThrow(()->
                new GlobalAppException(HttpStatus.BAD_REQUEST,
                        "The user ID does not have a registered person entity","dic code..")
        );
        if(person.getDni()!=person.getDni()){
            if(this.personRepo.existsByDni(personDTO.getDni())){
                throw new GlobalAppException(HttpStatus.BAD_REQUEST,
                        "The new ID belongs to another registered user ","dic code..");
            }
        }
        person.setName(personDTO.getName());
        person.setLastname(personDTO.getLastname());
        person.setDni(personDTO.getDni());
        this.personRepo.save(person);
        PersonDTO upPersonDTO = this.getPersonDTOByDni(personDTO.getDni());
        log.info("Update person: ", upPersonDTO);
        return upPersonDTO;
    }

//    @Transactional(propagation = Propagation.SUPPORTS)
    public void deletePersonById(Long id){
        Person person =this.personRepo.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Person","id",id));
        this.personRepo.deleteById(id);
    }

    private boolean validatePerson(PersonDTO person){
        if((person.getDni().length() < this.utilsComm.dniMin) ||
                (person.getDni().length() > this.utilsComm.dniMaxima)){
            throw new GlobalAppException(HttpStatus.BAD_REQUEST,
                    "The person DNI is not valid (size from "+this.utilsComm.dniMin
                            +" to "+this.utilsComm.dniMaxima+")","dic code..");
        }
        if(this.utilsComm.validarNumerosRepetidos(person.getDni(),"dni")){
            throw new GlobalAppException(HttpStatus.BAD_REQUEST,
                    "The DNI cannot be made up of repeated characters","dic code..");
        }
        return true;
    }

    private PersonDTO convertEntityToDTO(Person person){
        return this.modelMapper.map(person, PersonDTO.class);
    }

    private Person convertDTOToEntity(PersonDTO personDTO){
        return this.modelMapper.map(personDTO,Person.class);
    }
}
