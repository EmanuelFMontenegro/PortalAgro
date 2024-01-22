package com.dgitalfactory.usersecurity.service.FieldRelated;

import com.dgitalfactory.usersecurity.DTO.AppService.TypeServiceDTO;
import com.dgitalfactory.usersecurity.DTO.AppService.TypeServiceResponseDTO;
import com.dgitalfactory.usersecurity.DTO.TypePlantation.TypePlantationRequestDTO;
import com.dgitalfactory.usersecurity.DTO.TypePlantation.TypePlantationResponseDTO;
import com.dgitalfactory.usersecurity.entity.AppServices.TypeService;
import com.dgitalfactory.usersecurity.entity.Fields.TypePlantation;
import com.dgitalfactory.usersecurity.exception.GlobalAppException;
import com.dgitalfactory.usersecurity.repository.Fields.TypePlantationRespository;
import com.dgitalfactory.usersecurity.repository.RequestServices.TypeServiceRepository;
import com.dgitalfactory.usersecurity.service.CustomeErrorService;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 19/12/2023 - 10:41
 */
@Service
public class TypePlantationService {

    @Autowired
    private TypePlantationRespository typePlantationREPO;

    @Autowired
    private UtilsCommons utilsCommons;

    @Autowired
    private CustomeErrorService errorSVC;

    /**
     * Find all type plantations
     *
     * @return @{@link List<TypePlantation>}
     */
    private List<TypePlantation> getTypePlantation() {
        return this.typePlantationREPO.findAll();
    }

    /**
     * Get type service by is activate
     * @param active: type {@link String}
     * @return @{@link List<TypeServiceDTO>}
     */
    public List<TypePlantationRequestDTO> getAllTypePlantation(String active){
        if(active.isEmpty()){
            return this.getAllTypePlantationDTO();
        }
        if(active.equalsIgnoreCase("true") || active.equalsIgnoreCase("false")){
            return this.getTypePlantationsActive(Boolean.parseBoolean(active));
        }
        return this.getTypePlantationsActive(true);
    }

    /**
     * Find type plantations by is active
     * @param active: type @{@link Boolean} type service by is active
     * @return @{@link List<TypePlantationRequestDTO>}
     */
    public List<TypePlantationRequestDTO> getTypePlantationsActive(boolean active) {
        return this.typePlantationREPO.findByIsActive(active);
    }

    /**
     * Find type plantation DTO
     *
     * @return @{@link List<TypePlantationRequestDTO>}
     */
    public List<TypePlantationRequestDTO> getAllTypePlantationDTO() {
        List<TypePlantation> lista = this.getTypePlantation();
        if (lista.isEmpty()) {
            throw new GlobalAppException(HttpStatus.NO_CONTENT, 2006, utilsCommons.getMessage("field.name.field.typeplantation"));
        }
        return utilsCommons.mapListEntityDTO(lista, TypePlantationRequestDTO.class);
    }

    /**
     * Find type of plantation with name type plantation
     *
     * @param name: type @{@link String}
     * @return @{@link TypePlantation}
     */
    private TypePlantation getTypePlantation(String name) {
        return this.typePlantationREPO.findByName(name)
                .orElseThrow(
                        () -> errorSVC.getResourceNotFoundException(utilsCommons.getMessage("field.name.field.typeplantation"), "name", name)
                );
    }

    /**
     * Find type of plantation with id
     *
     * @param idTypePlantation: type @{@link Long}
     * @return @{@link TypePlantation}
     */
    public TypePlantation getTypePlantation(Long idTypePlantation) {
        return this.typePlantationREPO.findById(idTypePlantation)
                .orElseThrow(
                        () -> errorSVC.getResourceNotFoundException(
                                utilsCommons.getMessage("field.name.field.typeplantation"),
                                "idTypePlantation",
                                idTypePlantation)
                );
    }

    /**
     * Created type of plantation
     *
     * @param typePlantationResponseDTO: type @{@link TypePlantationResponseDTO}
     */
    public void addTypePlantation(TypePlantationResponseDTO typePlantationResponseDTO) {
        if (this.typePlantationREPO.existsByName(typePlantationResponseDTO.getName())) {
            throw new GlobalAppException(HttpStatus.BAD_REQUEST, 4029, utilsCommons.getMessage("field.name.field.typeplantation"));
        }
        TypePlantation typePlantation = utilsCommons.convertDTOToEntity(typePlantationResponseDTO, TypePlantation.class);
        typePlantation.setActive(true);
        this.typePlantationREPO.save(typePlantation);
    }

    /**
     * Update type of plantation
     *
     * @param typePlantationResponseDTO: type @{@link TypePlantationResponseDTO}
     */
    @Transactional(propagation = Propagation.SUPPORTS)
    public void updateTypePlantation(Long idTypePlantation, TypePlantationResponseDTO typePlantationResponseDTO) {
        TypePlantation typeService = this.getTypePlantation(idTypePlantation);
        if (!typeService.getName().equals(typePlantationResponseDTO.getName())) {
            if (this.typePlantationREPO.existsByName(typePlantationResponseDTO.getName())) {
                throw new GlobalAppException(HttpStatus.BAD_REQUEST, 4029, utilsCommons.getMessage("field.name.field.typeplantation"));
            }
        }
        typeService.setName(typePlantationResponseDTO.getName());
        typeService.setDescription(typePlantationResponseDTO.getDescription());
        this.typePlantationREPO.save(typeService);
    }

    /**
     * Delete Type of plantation with id
     *
     * @param idTypePlantation: type @{@link Long}
     */
    @Transactional(propagation = Propagation.SUPPORTS)
    public void deleteTypePlantationLogical(Long idTypePlantation) {
        TypePlantation typeService = this.getTypePlantation(idTypePlantation);
        typeService.setActive(false);
        this.typePlantationREPO.save(typeService);
    }

    /**
     * Activate typle plantation y id
     * @param idTypePlantation: type {@link Long}
     */
    @Transactional
    public void activeTypePlantationLogical(Long idTypePlantation) {
        TypePlantation typeService = this.getTypePlantation(idTypePlantation);
        typeService.setActive(true);
        this.typePlantationREPO.save(typeService);
    }

}
