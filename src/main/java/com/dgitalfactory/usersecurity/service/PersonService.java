package com.dgitalfactory.usersecurity.service;

import com.dgitalfactory.usersecurity.DTO.Person.PersonDTO;
import com.dgitalfactory.usersecurity.DTO.Person.PersonResponseDTO;
import com.dgitalfactory.usersecurity.DTO.Person.PersonRequestDTO;
import com.dgitalfactory.usersecurity.DTO.ResponsePaginationDTO;
import com.dgitalfactory.usersecurity.entity.Address;
import com.dgitalfactory.usersecurity.entity.Contact;
import com.dgitalfactory.usersecurity.entity.Person;
import com.dgitalfactory.usersecurity.exception.GlobalAppException;
import com.dgitalfactory.usersecurity.exception.GlobalMessageException;
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
import java.util.Objects;

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
     * Check user and person ID
     * @param user_id: type @{@link Long}
     * @param person_id: type {@link Long}
     * @return @{@link Boolean}
     */
    private Boolean checkUserIdPersonId(Long user_id, Long person_id ){
        if(!Objects.equals(user_id, person_id)){
            throw new GlobalMessageException(
                    HttpStatus.NOT_FOUND,
                    4011,
                    utilsCommons.getFormatMessage(
                            4033,
                            utilsCommons.getMessage("field.name.user"),
                            utilsCommons.getMessage("field.name.person")
                    ),
                    utilsCommons.getMessage("field.name.person")
            );
        }
        return true;
    }

    /**
     * Return Information of the Person searching bt id person
     *
     * @param user_id: type {@link Long}
     * @param person_id: type {@link Long}
     * @return personDTO: type @{@link PersonResponseDTO}
     */
    public PersonResponseDTO getPersonDtoById(Long user_id, Long person_id) {
        this.checkUserIdPersonId(user_id,person_id);
        return this.personRepo.findPersonDTOById(person_id)
                .orElseThrow(() -> errorSVC.getResourceNotFoundException("Person", "id", person_id));
    }

    /**
     * Fiind person by user id
     *
     * @param id: type @{@link Long}
     * @return person: type @{@link Person}
     */
    public Person getPersonById(Long id) {
        return this.personRepo.findById(id)
                .orElseThrow(() -> errorSVC.getResourceNotFoundException("Person", "id", id));
    }

    /**
     * Return information of the Person searching by DNI
     *
     * @param dniCuit: Type String
     * @return @{@link PersonResponseDTO}
     */
    public PersonResponseDTO getPersonDTOByDni(String dniCuit) {
        return this.personRepo.findPersonResponseDTOByDniCuit(dniCuit)
                .orElseThrow(() -> errorSVC.getResourceNotFoundException(
                        utilsCommons.getMessage("field.name.person"),
                        utilsCommons.getMessage("field.name.dnicuil"), dniCuit));
    }

    /**
     * return information of the person searching by DNI
     *
     * @param dniCuit: String DNI
     * @return @{@link Person}
     */
    public Person getPersonByDni(String dniCuit) {
        Person person = this.personRepo.findByDniCuit(dniCuit)
                .orElseThrow(() -> errorSVC.getResourceNotFoundException(
                        utilsCommons.getMessage("field.name.person"),
                        utilsCommons.getMessage("field.name.dnicuil"), dniCuit));
        return person;
    }

    /**
     * Return a list of all people
     *
     * @return @{@link List<@PersonDTO>}
     */
    public List<PersonDTO> getPeopleDTO() {
        List<PersonDTO> peopleDTO = this.personRepo.findAll().stream().map(
                person -> utilsCommons.convertEntityToDTO(person, PersonDTO.class)
        ).toList();
        return peopleDTO;
    }

    /**
     * @param pageNo:   type {@link Integer}
     * @param pageSize: type {@link Integer}
     * @param sortBy:   type {@link String}
     * @param sortDir:  type {@link String}
     * @return @{@link ResponsePaginationDTO}
     */
    public ResponsePaginationDTO<Object> getPeoplePagination(int pageNo, int pageSize, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<PersonResponseDTO> listField = this.personRepo.findAllPersonDTOOrderByLastname(pageable);
        List<PersonResponseDTO> listDTO = listField.getContent();
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
     * Create person for user
     *
     * @param userid:           Long userid
     */
    @Transactional(propagation = Propagation.SUPPORTS)
    public void addPerson(Long userid) {
        //validar datos
        if (this.personRepo.existsById(userid)) {
            throw new GlobalAppException(HttpStatus.BAD_REQUEST, 4021, utilsCommons.getMessage("field.name.person"));
        }
        Person person = Person.builder()
                .id(userid)
                .address(Address.builder().build())
                .contact(Contact.builder().build())
                .build();
        this.personRepo.save(person);
    }

    /**
     * Update person records
     *
     * @param user_id: type @{@link Long}
     * @param person_id: type {@link Long}
     * @param personDTO: @{@link PersonRequestDTO}
     * @return @{@link PersonResponseDTO}
     */
//    @Transactional(propagation = Propagation.SUPPORTS)
    public PersonResponseDTO updatePerson(Long user_id, Long person_id, PersonRequestDTO personDTO) {
        this.checkUserIdPersonId(user_id,person_id);
        //validar datos
        this.validatePerson(personDTO);
        Person person = this.personRepo.findById(person_id).orElseThrow(() ->
                new GlobalAppException(HttpStatus.BAD_REQUEST, 4022, utilsCommons.getMessage("field.name.person"))
        );
        if (person.getDniCuit() != person.getDniCuit()) {
            if (this.personRepo.existsByDniCuit(personDTO.getDniCuit())) {
                throw new GlobalAppException(HttpStatus.BAD_REQUEST, 4023, utilsCommons.getMessage("field.name.person"));
            }
        }
        person.setName(personDTO.getName());
        person.setLastname(personDTO.getLastname());
        person.setDniCuit(personDTO.getDniCuit());
        person.setDescriptions(personDTO.getDescriptions());
        person.getAddress().setLocation(personDTO.getLocation());
        person.getContact().setTelephone(personDTO.getTelephone());
        this.personRepo.save(person);

        PersonResponseDTO upPersonDTO = this.getPersonDTOByDni(personDTO.getDniCuit());
        log.info("Update person: ", upPersonDTO);

        return upPersonDTO;
    }

    /**
     * Delete person
     *
     * @param id: Long personid
     */
//    @Transactional(propagation = Propagation.SUPPORTS)
    public void deletePersonById(Long id) {
        Person person = this.personRepo.findById(id)
                .orElseThrow(() -> errorSVC.getResourceNotFoundException(
                        utilsCommons.getMessage("field.name.person"),
                        utilsCommons.getMessage("ID"), id));
        this.personRepo.deleteById(id);
    }

    /**
     * Verify person fields
     *
     * @param person: @{@link PersonRequestDTO}
     * @return @{@link Boolean}
     */
    private boolean validatePerson(PersonRequestDTO person) {
        if (UtilsCommons.validarNumerosRepetidos(person.getDniCuit(), "cuitCuil")) {
            throw new GlobalAppException(HttpStatus.NOT_FOUND, 2024, utilsCommons.getMessage("field.name.person"));
        }
        return true;
    }

    /**
     * Verify person fields
     *
     * @param person: @{@link PersonDTO}
     * @return @{@link Boolean}
     */
    private boolean validatePerson(PersonDTO person) {
        if (UtilsCommons.validarNumerosRepetidos(person.getDniCuit(), "cuitCuil")) {
            throw new GlobalAppException(HttpStatus.NOT_FOUND, 2024, utilsCommons.getMessage("field.name.person"));
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
