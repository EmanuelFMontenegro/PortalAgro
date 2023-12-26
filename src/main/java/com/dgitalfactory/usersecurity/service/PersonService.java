package com.dgitalfactory.usersecurity.service;

import com.dgitalfactory.usersecurity.DTO.Person.PersonDTO;
import com.dgitalfactory.usersecurity.DTO.Person.PersonResponseDTO;
import com.dgitalfactory.usersecurity.DTO.ResponsePaginationDTO;
import com.dgitalfactory.usersecurity.entity.Person;
import com.dgitalfactory.usersecurity.exception.GlobalAppException;
import com.dgitalfactory.usersecurity.exception.ResourceNotFoundException;
import com.dgitalfactory.usersecurity.repository.PersonRepository;
import com.dgitalfactory.usersecurity.utils.AppConstants;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Service
public class PersonService {
    private static final Logger log = LoggerFactory.getLogger(PersonService.class);

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private PersonRepository personRepo;

    @Autowired
    private UtilsCommons utilsCommons;

    @Autowired
    private CustomeErrorService errorSVC;

    /**
     * Return Information of the Person searching bt id person
     *
     * @param id: type {@link Long}
     * @return personDTO: type @{@link PersonDTO}
     */
    public PersonDTO getPersonDtoById(Long id){
        Person person =this.personRepo.findById(id)
                .orElseThrow(()-> errorSVC.getResourceNotFoundException("Person","id",id));
        return utilsCommons.convertEntityToDTO(person,PersonDTO.class);
    }

    /**
     * Fiind person by user id
     * @param id: type @{@link Long}
     * @return person: type @{@link Person}
     */
    public Person getPersonById(Long id){
       return this.personRepo.findById(id)
                .orElseThrow(()-> errorSVC.getResourceNotFoundException("Person","id",id));
    }

    /**
     * Return information of the Person searching by DNI
     * @param dni: Type String
     * @return @{@link PersonDTO}
     */
    public PersonDTO getPersonDTOByDni(String dni){
        Person person =this.personRepo.findByDni(dni)
                .orElseThrow(()-> errorSVC.getResourceNotFoundException("Person","DNI",dni));
        return utilsCommons.convertEntityToDTO(person,PersonDTO.class);
    }

    /**
     * return information of the person searching by DNI
     * @param dni: String DNI
     * @return @{@link Person}
     */
    public Person getPersonByDni(String dni){
        Person person =this.personRepo.findByDni(dni)
                .orElseThrow(()-> errorSVC.getResourceNotFoundException("Person","DNI",dni));
        return person;
    }

    /**
     * Return a list of all people
     * @return @{@link List<@PersonDTO>}
     */
    public List<PersonDTO> getPeopleDTO(){
        List<PersonDTO> peopleDTO = this.personRepo.findAll().stream().map(
                person -> utilsCommons.convertEntityToDTO(person,PersonDTO.class)
        ).toList();
        return peopleDTO;
    }

    /**
     *
     * @param pageNo: type {@link Integer}
     * @param pageSize: type {@link Integer}
     * @param sortBy: type {@link String}
     * @param sortDir: type {@link String}
     * @return @{@link ResponsePaginationDTO}
     */
    public ResponsePaginationDTO<Object> getPeoplePagination(int pageNo, int pageSize, String sortBy, String sortDir){
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<Person> listField = this.personRepo.findAllByOrderByLastnameAscNameAsc(pageable);
        List<Person> list = listField.getContent();
        List<PersonDTO> listDTO = utilsCommons.mapListEntityDTO(list, PersonDTO.class);
        return ResponsePaginationDTO.builder()
                .list(Collections.singletonList(listDTO))
                .pageNo(listField.getNumber())
                .pageSize(listField.getSize())
                .pageTotal(listField.getTotalPages())
                .itemsTotal(listField.getTotalPages())
                .pageLast(listField.isLast())
                .build();
    }


    /**
     * Create person record
     * @param userid: Long userid
     * @param personResponseDTO: @{@link PersonResponseDTO}
     */
    @Transactional(propagation = Propagation.SUPPORTS)
    public void addPerson(Long userid, PersonResponseDTO personResponseDTO){
        //validar datos
        if(this.personRepo.existsById(userid)){
            throw new GlobalAppException(HttpStatus.BAD_REQUEST, 4021,"");
        }
//        this.validatePerson(personDTO);
        log.info("ESTA DESHABILITADA LA VALIDACION DE LOS CAMPOS DE PERSONA PORQUE AUN NO LLEGAMOS A CARGAR EL PERFIL");

        Person person = utilsCommons.convertDTOToEntity(personResponseDTO,Person.class);
        person.setId(userid);
        this.personRepo.save(person);
    }

    /**
     * Update person records
     * @param userid: String userid
     * @param personDTO: @{@link PersonDTO}
     * @return @{@link PersonDTO}
     */
//    @Transactional(propagation = Propagation.SUPPORTS)
    public PersonDTO updatePerson(Long userid, PersonDTO personDTO){
        //validar datos
        this.validatePerson(personDTO);
        Person person = this.personRepo.findById(userid).orElseThrow(()->
                new GlobalAppException(HttpStatus.BAD_REQUEST, 4022,"")
        );
        if(person.getDni()!=person.getDni()){
            if(this.personRepo.existsByDni(personDTO.getDni())){
                throw new GlobalAppException(HttpStatus.BAD_REQUEST, 4023,"");
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

    /**
     * Delete person
     * @param id: Long personid
     */
//    @Transactional(propagation = Propagation.SUPPORTS)
    public void deletePersonById(Long id){
        Person person =this.personRepo.findById(id)
                .orElseThrow(()-> errorSVC.getResourceNotFoundException("Person","id",id));
        this.personRepo.deleteById(id);
    }

    /**
     * Verify person fields
     *
     * @param person: @{@link PersonDTO}
     * @return @{@link Boolean}
     */
    private boolean validatePerson(PersonDTO person){
        if((person.getDni().length() < AppConstants.DNI_MIN) ||
                (person.getDni().length() > AppConstants.DNI_MAX)){
            throw new GlobalAppException(HttpStatus.NOT_FOUND, 4012,"El DNI debe tener una longitud mínima de "+AppConstants.DNI_MIN
                    +" y maxima de "+AppConstants.DNI_MAX +")");
        }
        if(UtilsCommons.validarNumerosRepetidos(person.getDni(),"dni")){
            throw new GlobalAppException(HttpStatus.NOT_FOUND,2024,"");
        }
        return true;
    }

//    /**
//     * Convert @{@link Person} to @{@link PersonDTO}
//     * @param person: @{@link Person}
//     * @return @{@link PersonDTO}
//     */
//    private PersonDTO convertEntityToDTO(Person person){
//        return this.modelMapper.map(person, PersonDTO.class);
//    }
//
//    /**
//     * Convert @{@link PersonDTO} to @{@link Person}
//     * @param personDTO
//     * @return
//     */
//    private Person convertDTOToEntity(PersonDTO personDTO){
//        return this.modelMapper.map(personDTO,Person.class);
//    }
//    /**
//     * Convert @{@link PersonResponseDTO} to @{@link Person}
//     * @param personResponseDTO
//     * @return
//     */
//    private Person convertDTOToEntity(PersonResponseDTO personResponseDTO){
//        return this.modelMapper.map(personResponseDTO,Person.class);
//    }
}
