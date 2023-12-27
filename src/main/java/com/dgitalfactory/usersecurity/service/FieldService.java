package com.dgitalfactory.usersecurity.service;

import com.dgitalfactory.usersecurity.DTO.Field.FieldDTO;
import com.dgitalfactory.usersecurity.DTO.Field.FieldResponseDTO;
import com.dgitalfactory.usersecurity.DTO.Field.GeolocationDTO;
import com.dgitalfactory.usersecurity.DTO.ResponsePaginationDTO;
import com.dgitalfactory.usersecurity.entity.Contact;
import com.dgitalfactory.usersecurity.entity.Field;
import com.dgitalfactory.usersecurity.exception.GlobalAppException;
import com.dgitalfactory.usersecurity.exception.GlobalMessageException;
import com.dgitalfactory.usersecurity.repository.FieldRepository;
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
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 04/12/2023 - 16:10
 */
@Service
public class FieldService {
    private static final Logger log = LoggerFactory.getLogger(FieldService.class);

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private FieldRepository fieldRepo;

    @Autowired
    private PersonService personSVC;

    @Autowired
    private UtilsCommons utilsCommons;

    @Autowired
    private CustomeErrorService errorSVC;


    /**
     * Find a field with id
     * @param field_id: type {@link Long}
     * @return @{@link Field}
     */
    public Field getFieldById(Long field_id){
        return this.fieldRepo.findById(field_id)
                .orElseThrow(()-> errorSVC.getResourceNotFoundException("Field ID","field_id", field_id));
    }

    /**
     * Find a field with id
     * @param field_id: type {@link Long}
     * @return @{@link FieldDTO}
     */
    public FieldDTO getFielDTOdById(Long field_id){
        return this.fieldRepo.findFieldDTOById(field_id)
                .orElseThrow(()-> errorSVC.getResourceNotFoundException("Field ID","field_id", field_id));
    }

    /**
     * Check if field with that name exists for that user ID
     * @param name: : type {@link String} name field
     * @param userid: type {@link Long} user ID
     * @return @{@link Boolean}
     */
    public boolean existsFieldByName(String name, Long userid){
        return this.fieldRepo.existsByFieldNameAndUserId(name, userid);
    }

    /**
     * Check if field with that ID exists for that user ID
     * @param fieldId: : type {@link Long} field ID
     * @param userId: type {@link Long} user ID
     * @return @{@link Boolean}
     */
    public boolean existsFieldIdByUserId(Long fieldId, Long userId){
        return this.fieldRepo.existsByFieldIdAndUserId(fieldId, userId);
    }

    /**
     * Check if field id with user id exists
     * @param field_id: type {@link Long}
     * @param user_id: type {@link Long}
     */
    public void verifyExistsFieldUser(Long field_id, Long user_id){
        if(!this.existsFieldIdByUserId(field_id,user_id)){
            throw new GlobalMessageException(
                    HttpStatus.NOT_FOUND, 4033,
                    utilsCommons.getFormatMessage(
                            utilsCommons.getStatusMessage(4033),
                            utilsCommons.getMessage("field.name.user"),
                            utilsCommons.getMessage("field.name.field")
                    ),
                    utilsCommons.getMessage("field.name.field.service"));
        }
    }

    /**
     * Find a field with name
     * @param name: type {@link String}
     * @return @{@link Field}
     */
    public Field getFieldByName(String name){
        return this.fieldRepo.findByName(name)
                .orElseThrow(()-> errorSVC.getResourceNotFoundException("Field","name", name));
    }

    /**
     * Delte a field with id
     * @param field_id: type {@link Long}
     * @return Field
     */
    public void deleteFieldById(Long field_id, Long user_Id){
        if(this.existsFieldIdByUserId(field_id,user_Id)){
            this.fieldRepo.deleteById(field_id);
            return;
        }
        throw new GlobalMessageException(
                HttpStatus.NOT_FOUND,4033,
                utilsCommons.getFormatMessage(
                        utilsCommons.getStatusMessage(4033),
                        utilsCommons.getMessage("field.name.field"),
                        utilsCommons.getMessage("field.name.user")
                        ),
                utilsCommons.getMessage("field.name.field"));
    }

    /**
     * Return information of the @{@link Field} searching by person id
     * @param person_id: Long
     * @return @{@link Field}
     */
    public List<Field> getAllFieldByPersonId(Long person_id){
        return this.fieldRepo.findByPersonId(person_id)
                .orElseThrow(()->errorSVC.getResourceNotFoundException("All Fields","Person_id", person_id));
    }

    /**
     * Find all fiels with pagination
     * @param pageNo: type {@link Integer}
     * @param pageSize: type {@link Integer}
     * @param sortBy: type {@link String}
     * @param sortDir: type {@link String}
     * @return @{@link ResponsePaginationDTO}
     */
    public ResponsePaginationDTO<Object> getAllFieldsUsers(int pageNo, int pageSize, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<FieldDTO> listField = this.fieldRepo.findAllFieldsDTO(pageable);
        List<FieldDTO> list = listField.getContent();
        if(list.isEmpty()){
            throw new GlobalAppException(HttpStatus.OK,2006,utilsCommons.getMessage("field.name.field"));
        }
        return ResponsePaginationDTO.builder()
                .list(Collections.singletonList(list))
                .pageNo(listField.getNumber())
                .pageSize(listField.getSize())
                .pageTotal(listField.getTotalPages())
                .itemsTotal(listField.getTotalPages())
                .pageLast(listField.isLast())
                .build();
    }

    /**
     * Find all fields by person/user id
     * @param pageNo: type {@link Integer}
     * @param pageSize: type {@link Integer}
     * @param sortBy: type {@link String}
     * @param sortDir: type {@link String}
     * @param user_id: Type {@link Long}
     * @return @{@link ResponsePaginationDTO}
     */
    public ResponsePaginationDTO<Object> getAllFieldDTOdsByUserId(int pageNo, int pageSize, String sortBy, String sortDir,
                                                                  Long user_id){
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<FieldDTO> listObject = this.fieldRepo.findAllFieldsDTOByUserId(user_id, pageable);
        List<FieldDTO> list = listObject.getContent();
        if(list.isEmpty()){
            throw new GlobalAppException(HttpStatus.OK,2006,utilsCommons.getMessage("field.name.field"));
        }
        return ResponsePaginationDTO.builder()
                .list(Collections.singletonList(list))
                .pageNo(listObject.getNumber())
                .pageSize(listObject.getSize())
                .pageTotal(listObject.getTotalPages())
                .itemsTotal(listObject.getTotalPages())
                .pageLast(listObject.isLast())
                .build();
    }


    /**
     * Create a new user field
     * @param person_id: type @{@link Long}
     * @param fieldResponseDTO: type @{@link FieldResponseDTO}
     */
    @Transactional()
    public void addField(Long person_id, FieldResponseDTO fieldResponseDTO){
        if(this.fieldRepo.existsByFieldNameAndUserId(fieldResponseDTO.getName(), person_id)){
            throw new GlobalAppException(HttpStatus.NOT_FOUND,4029,utilsCommons.getMessage("field.name.field"));
        }
        Field field = utilsCommons.convertDTOToEntity(fieldResponseDTO, Field.class);
        if(field.getContact()==null){
            Contact contact = new Contact();
            field.setContact(contact);
        }
        field.setPerson(this.personSVC.getPersonById(person_id));
        Field newField = this.fieldRepo.save(field);
        log.info("Field create: "+field.toString());
    }

    /**
     * Update a user field
     * @param person_id: type @{@link Long}
     * @param fieldResponseDTO: type @{@link FieldResponseDTO}
     */
    @Transactional()
    public FieldDTO updateField(Long person_id, Long field_id,FieldResponseDTO fieldResponseDTO){
//        Capitalizer fields
        Field field = this.getFieldById(field_id);
        if(!field.getName().equals(fieldResponseDTO.getName())){
            if(this.fieldRepo.findByName(fieldResponseDTO.getName()).isPresent()){
                throw new GlobalAppException(HttpStatus.NOT_FOUND,4029,utilsCommons.getMessage("field.name.field"));
            }
        }
        //ADDRESSS
        field.getAddress().setAddress(fieldResponseDTO.getAddress().getAddress());
        field.getAddress().setLocation(fieldResponseDTO.getAddress().getLocation());
        //FIELD
        field.setName(fieldResponseDTO.getName());
        field.setObservation(fieldResponseDTO.getObservation());
        field.setDimensions(fieldResponseDTO.getDimensions());
        field.setGeolocation(fieldResponseDTO.getGeolocation());

        Field newField = this.fieldRepo.save(field);
        log.info("FieldDTO: "+fieldResponseDTO.toString());
        log.info("Field update: "+field.toString());
        return utilsCommons.convertEntityToDTO(newField,FieldDTO.class);
    }

    /**
     * Find geolocation to field
     * @param field_id: type {@link Long}
     * @return @{@link GeolocationDTO}
     */
    public GeolocationDTO getGeolocationDTOByFieldId(Long field_id){
        String geolocation  = this.fieldRepo.getGeolocationByFieldId(field_id);
        if(geolocation == null) throw errorSVC.getResourceNotFoundException(
                utilsCommons.getMessage("field.name.field.geolocation"),"field_id",field_id);
        return GeolocationDTO.builder().geolocation(geolocation).build();
    }

    /**
     * Add geolocation to field
     * @param field_id: type {@link Long}
     * @return @{@link GeolocationDTO}
     */
    @Transactional
    public void updateGeolocationDTOByFieldId(Long field_id, GeolocationDTO geolocationDTO){
        this.getFieldById(field_id);
        this.fieldRepo.updateGeolocationByFieldId(field_id, geolocationDTO.getGeolocation());
    }

    /**
     * Verify if exists field with id field
     * @param field_id: type {@link Long}
     * @return @{@link Boolean}
     */
    public boolean existsField(Long field_id){
        return  this.fieldRepo.existsById(field_id);
    }

}
