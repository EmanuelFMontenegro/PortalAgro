package com.dgitalfactory.usersecurity.service;

import com.dgitalfactory.usersecurity.DTO.Person.*;
import com.dgitalfactory.usersecurity.DTO.ResponsePaginationDTO;
import com.dgitalfactory.usersecurity.entity.Address;
import com.dgitalfactory.usersecurity.entity.Contact;
import com.dgitalfactory.usersecurity.entity.Location.Location;
import com.dgitalfactory.usersecurity.entity.Person;
import com.dgitalfactory.usersecurity.exception.GlobalAppException;
import com.dgitalfactory.usersecurity.exception.GlobalMessageException;
import com.dgitalfactory.usersecurity.repository.PersonRepository;
import com.dgitalfactory.usersecurity.security.dto.RoleResponseDTO;
import com.dgitalfactory.usersecurity.security.dto.UserResponseDTO;
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

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

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
    private LocationService locationSVC;

    @Autowired
    private UtilsCommons utilsCommons;

    @Autowired
    private CustomeErrorService errorSVC;

    /**
     * Check user and person ID
     *
     * @param user_id:   type @{@link Long}
     * @param person_id: type {@link Long}
     * @return @{@link Boolean}
     */
    private Boolean checkUserIdPersonId(Long user_id, Long person_id) {
        if (!Objects.equals(user_id, person_id)) {
            throw new GlobalMessageException(
                    HttpStatus.NOT_FOUND,
                    4011,
                    utilsCommons.getFormatMessage(
                            4033,
                            utilsCommons.getMessage("field.name.user"),
                            "user_id",
                            utilsCommons.getMessage("field.name.person"),
                            "person_id"
                    ),
                    utilsCommons.getMessage("field.name.person")
            );
        }
        return true;
    }

    /**
     * Return Information of the Person searching bt id person
     *
     * @param user_id:   type {@link Long}
     * @param person_id: type {@link Long}
     * @return personDTO: type @{@link PersonResponseDTO}
     */
    public PersonResponseDTO getPersonDtoById(Long user_id, Long person_id) {
        this.checkUserIdPersonId(user_id, person_id);
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
     * @param dni: Type {@link String}: DNI by person
     * @return @{@link PersonResponseDTO}
     */
    public PersonResponseDTO getPersonDTOByDni(String dni) {
        return this.personRepo.findPersonResponseDTOByDni(dni)
                .orElseThrow(() -> errorSVC.getResourceNotFoundException(
                        utilsCommons.getMessage("field.name.person"),
                        utilsCommons.getMessage("field.name.dni"), dni));
    }

    /**
     * Check if exists person by DNI
     *
     * @param dni: type {@link String}
     * @return @{@link Boolean}
     */
    public boolean existPersonByDni(String dni) {
        return this.personRepo.existsByDni(dni);
    }


    /**
     * return information of the person searching by DNI
     *
     * @param dni: String DNI
     * @return @{@link Person}
     */
    public Person getPersonByDni(String dni) {
        Person person = this.personRepo.findByDni(dni)
                .orElseThrow(() -> errorSVC.getResourceNotFoundException(
                        utilsCommons.getMessage("field.name.person"),
                        utilsCommons.getMessage("field.name.dni"), dni));
        return person;
    }

    /**
     * Find data for profile user
     *
     * @param user_id:   type {@link Long}
     * @param person_id: type {@link Long}
     * @return @{@link PersonUserProfile}
     */
    public PersonUserProfile getPersonUserProfileById(Long user_id, Long person_id) {
        this.checkUserIdPersonId(user_id, person_id);
        return this.personRepo.findPersonUserProfile(user_id)
                .orElseThrow(() -> errorSVC.getResourceNotFoundException("Person", "id", user_id));
//        return PersonUserProfile.builder()
//                .id((Long)data[0])
//                .name((String) data[1])
//                .lastname((String) data[2])
//                .username((String) data[3])
//                .avatar("url://")
//                .build();
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
    public ResponsePaginationDTO<Object> getPeoplePagination(int pageNo, int pageSize, String sortBy, String sortDir, String anyNames) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<PersonResponseDTO> listField;
        if (anyNames.isEmpty()) {
            listField = this.personRepo.findAllPersonDTOPageable(pageable);
        } else {
            listField = this.personRepo.findByNameOrLastNameLike(anyNames, pageable);
        }
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
     * @param pageNo:   type {@link Integer}
     * @param pageSize: type {@link Integer}
     * @param sortBy:   type {@link String}
     * @param sortDir:  type {@link String}
     * @return @{@link ResponsePaginationDTO}
     */
    public ResponsePaginationDTO<Object> getPeopleUserPagination(int pageNo, int pageSize, String sortBy, String sortDir, String anyNames) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<Object[]> listField;
        if (anyNames.isEmpty()) {
            listField = this.personRepo.findAllPersonUserPageable(pageable);
        } else {
            listField = this.personRepo.findAllPersonUserByNamesPageable(anyNames, pageable);
        }
        List<PersonUserResponseDTO> listDTO = listField.getContent().stream()
                .map(this::mapPersonUserToObjetArray).toList();
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
     * @param userid: Long userid
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
     * @param user_id:   type @{@link Long}
     * @param person_id: type {@link Long}
     * @param personDTO: @{@link PersonRequestDTO}
     * @return @{@link PersonResponseDTO}
     */
    public PersonResponseDTO updatePerson(Long user_id, Long person_id, PersonRequestDTO personDTO) {
        this.checkUserIdPersonId(user_id, person_id);
        Location locationNew = this.locationSVC.getLocationById(personDTO.getLocation_id());

        Person person = this.personRepo.findById(person_id).orElseThrow(() ->
                new GlobalAppException(HttpStatus.BAD_REQUEST, 4022, utilsCommons.getMessage("field.name.person"))
        );

        this.validatePerson(personDTO, person);

        person.setName(personDTO.getName());
        person.setLastname(personDTO.getLastname());
        person.setDni(personDTO.getDni());
        person.setDescriptions(personDTO.getDescriptions());
        if (person.getAddress() != null) {
            person.getAddress().setLocation(locationNew);
        } else {
            person.setAddress(Address.builder().location(locationNew).build());
        }
        if (person.getContact() != null) {
            person.getContact().setTelephone(personDTO.getTelephone());
        } else {
            person.setContact(Contact.builder().telephone(personDTO.getTelephone()).build());
        }
        this.personRepo.save(person);

        return this.getPersonDTOByDni(personDTO.getDni());
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
     */
    private void validatePerson(PersonRequestDTO personDTO, Person person) {
        String dniDTO = personDTO.getDni();
        String dniClass = person.getDni();

        if (!dniDTO.equals(dniClass)) {
            if (UtilsCommons.validarNumerosRepetidosDni(dniDTO)) {
                throw new GlobalAppException(HttpStatus.NOT_FOUND, 4024, utilsCommons.getMessage("field.name.person"));
            }
            if (this.personRepo.existsByDni(dniDTO)) {
                    throw new GlobalAppException(HttpStatus.BAD_REQUEST, 4023, utilsCommons.getMessage("field.name.person"));
            }
        }
    }

    /**
     * Mapping Objets[] and building classes person and user data with their roles
     *
     * @param objectArray: type @{@link Object[]}
     * @return @{@link PersonUserResponseDTO}
     */
    private PersonUserResponseDTO mapPersonUserToObjetArray(Object[] objectArray) {
        PersonUserResponseDTO personUserResDTO = new PersonUserResponseDTO();
        UserResponseDTO userDto = new UserResponseDTO();

        personUserResDTO.setId((Long) objectArray[0]);
        userDto.setId((Long) objectArray[0]);
        userDto.setUsername((String) objectArray[1]);
        userDto.setAccount_active((Boolean) objectArray[2]);
        userDto.setAccountNonLocked((Boolean) objectArray[3]);
        userDto.setFailedAttempts((Integer) objectArray[4]);
        userDto.setLockeTime((LocalDateTime) objectArray[5]);
        // Manejo específico para roles
        Object rolesObject = objectArray[6];
        if (rolesObject instanceof Object[] rolesArray) {
            Set<RoleResponseDTO> rolesSet = Arrays.stream(rolesArray)
                    .map(roleData -> {
                        String rolesString = (String) roleData;
                        String[] arrDataRole = rolesString.split(",");
                        if (arrDataRole.length == 2) {
                            return RoleResponseDTO.builder()
                                    .id(Long.parseLong(arrDataRole[0]))
                                    .name(arrDataRole[1].replaceAll("^ROLE_", ""))
                                    .build();
                        }
                        return null;
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet());

            userDto.setRoles(rolesSet);
        }
        personUserResDTO.setUserResponseDTO(userDto);
        personUserResDTO.setName((String) objectArray[7]);
        personUserResDTO.setLastname((String) objectArray[8]);
        personUserResDTO.setDni((String) objectArray[9]);
        personUserResDTO.setDescriptions((String) objectArray[10]);
        personUserResDTO.setLocation_id((Long) objectArray[11]);
        personUserResDTO.setTelephone((String) objectArray[12]);

        return personUserResDTO;
    }

}
