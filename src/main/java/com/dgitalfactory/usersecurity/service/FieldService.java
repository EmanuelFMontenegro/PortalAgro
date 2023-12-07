package com.dgitalfactory.usersecurity.service;

import com.dgitalfactory.usersecurity.DTO.FieldDTO;
import com.dgitalfactory.usersecurity.DTO.FieldResponseDTO;
import com.dgitalfactory.usersecurity.DTO.FieldsResPaginationDTO;
import com.dgitalfactory.usersecurity.entity.Address;
import com.dgitalfactory.usersecurity.entity.Field;
import com.dgitalfactory.usersecurity.exception.GlobalAppException;
import com.dgitalfactory.usersecurity.exception.ResourceNotFoundException;
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
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;

import java.util.List;
import java.util.stream.Collectors;

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


    /**
     * Find a field with id
     * @param field_id: type {@link Long}
     * @return @{@link Field}
     */
    public Field getFieldById(Long field_id){
        return this.fieldRepo.findById(field_id)
                .orElseThrow(()-> new ResourceNotFoundException("Field","field_id", field_id));
    }

    /**
     * Find a field with id
     * @param field_id: type {@link Long}
     * @return @{@link FieldDTO}
     */
    public FieldDTO getFieldDTOById(Long field_id){
        Field field = this.getFieldById(field_id);
        return UtilsCommons.convertEntityToDTO(field, FieldDTO.class);
    }

    /**
     * Delte a field with id
     * @param field_id: type {@link Long}
     * @return Field
     */
    public void deleteFieldById(Long field_id){
        this.getFieldById(field_id);
        this.fieldRepo.deleteById(field_id);
    }

    /**
     * Return information of the @{@link Field} searching by person id
     * @param person_id: Long
     * @return @{@link Field}
     */
    public List<Field> getAllFieldByPersonId(Long person_id){
        return this.fieldRepo.findByPersonId(person_id)
                .orElseThrow(()-> new ResourceNotFoundException("All Fields","Person_id", person_id));
    }

    public FieldsResPaginationDTO getAllFieldsUsers(int pageNo, int pageSize, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<Field> listField = this.fieldRepo.findAll(pageable);
        List<Field> list = listField.getContent();
        List<FieldDTO> listDTO = UtilsCommons.mapListEntityDTO(list, FieldDTO.class);
        return FieldsResPaginationDTO.builder()
                .fieldDTOList(listDTO)
                .pageNo(listField.getNumber())
                .pageSize(listField.getSize())
                .pageTotal(listField.getTotalPages())
                .itemsTotal(listField.getTotalPages())
                .pageLast(listField.isLast())
                .build();
    }

    /**
     * Find all fields by person/user id
     * @param person_id
     * @return
     */
    public List<FieldDTO> getAllFielDTOdsByUserId(Long person_id){
        List<Field> listField = this.fieldRepo.findByPersonId(person_id)
                .orElseThrow(
                        ()-> new ResourceNotFoundException("Id person", "person_id", person_id));

        List<FieldDTO> listFieldDTO =UtilsCommons.mapListEntityDTO(listField, FieldDTO.class);
//        List<FieldDTO> listField = this.fieldRepo.findByPersonId(person_id)
//                .orElseThrow(
//                        ()-> new ResourceNotFoundException("Id person", "person_id", person_id))
//                .stream().map(
//                        field -> UtilsCommons.convertEntityToDTO(field,FieldDTO.class)
//                ).collect(Collectors.toList());
        if(listField.isEmpty()){
            throw new GlobalAppException(HttpStatus.NO_CONTENT,2006,"Campos asociados con id "+person_id);
        }
        return listFieldDTO;
    }


    /**
     * Create a new user field
     * @param person_id: type @{@link Long}
     * @param fieldResponseDTO: type @{@link FieldResponseDTO}
     */
    @Transactional()
    public void addField(Long person_id, FieldResponseDTO fieldResponseDTO){
//        Capitalizer fields
        Field field = UtilsCommons.convertDTOToEntity(fieldResponseDTO, Field.class);
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
        //ADDRESSS
        field.getAddress().setAddress(fieldResponseDTO.getAddress().getAddress());
        field.getAddress().setLocation(fieldResponseDTO.getAddress().getLocation());
        //FIELD
        field.setName(fieldResponseDTO.getName());
        field.setDescription(fieldResponseDTO.getDescription());
        field.setDimensions(fieldResponseDTO.getDimensions());
        field.setGeolocation(fieldResponseDTO.getGeolocation());

        Field newField = this.fieldRepo.save(field);
        log.info("FieldDTO: "+fieldResponseDTO.toString());
        log.info("Field update: "+field.toString());
        return UtilsCommons.convertEntityToDTO(newField,FieldDTO.class);
    }

}
