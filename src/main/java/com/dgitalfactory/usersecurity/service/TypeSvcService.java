package com.dgitalfactory.usersecurity.service;

import com.dgitalfactory.usersecurity.DTO.AppService.TypeServiceDTO;
import com.dgitalfactory.usersecurity.DTO.AppService.TypeServiceResponseDTO;
import com.dgitalfactory.usersecurity.entity.AppServices.TypeService;
import com.dgitalfactory.usersecurity.exception.GlobalAppException;
import com.dgitalfactory.usersecurity.repository.TypeServiceRepository;
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
public class TypeSvcService {

    @Autowired
    private TypeServiceRepository typeSvcREPO;

    @Autowired
    private UtilsCommons utilsCommons;

    @Autowired
    private CustomeErrorService errorSVC;

    /**
     * Find all type service
     *
     * @return @{@link List<TypeService>}
     */
    private List<TypeService> getTypeServies() {
        return this.typeSvcREPO.findAll();
    }

    /**
     * Get type service by is activate
     * @param active: type {@link String}
     * @return @{@link List<TypeServiceDTO>}
     */
    public List<TypeServiceDTO> getAllTypeServies(String active){
        if(active.isEmpty()){
            return this.getAllTypeServiceDTO();
        }
        if(active.equalsIgnoreCase("true") || active.equalsIgnoreCase("false")){
            return this.getTypeServiesIsActive(Boolean.parseBoolean(active));
        }
        return this.getTypeServiesIsActive(true);
    }

    /**
     * Find type service by is active
     * @param active: type @{@link Boolean} type service by is active
     * @return @{@link List<TypeServiceDTO>}
     */
    public List<TypeServiceDTO> getTypeServiesIsActive(boolean active) {
        return this.typeSvcREPO.findByIsActive(active);
    }

    /**
     * Find type service DTO
     *
     * @return @{@link List<TypeServiceDTO>}
     */
    public List<TypeServiceDTO> getAllTypeServiceDTO() {
        List<TypeService> lista = this.getTypeServies();
        if (lista.isEmpty()) {
            throw new GlobalAppException(HttpStatus.NO_CONTENT, 2006, utilsCommons.getMessage("field.name.service.type"));
        }
        return utilsCommons.mapListEntityDTO(lista, TypeServiceDTO.class);
    }

    /**
     * Find type of service with name type service
     *
     * @param name: type @{@link String}
     * @return @{@link TypeService}
     */
    private TypeService getTypeService(String name) {
        return this.typeSvcREPO.findByName(name)
                .orElseThrow(
                        () -> errorSVC.getResourceNotFoundException("Name Service", "name", name)
                );
    }

    /**
     * Find type of service with id
     *
     * @param idTypeService: type @{@link Long}
     * @return @{@link TypeService}
     */
    public TypeService getTypeService(Long idTypeService) {
        return this.typeSvcREPO.findById(idTypeService)
                .orElseThrow(
                        () -> errorSVC.getResourceNotFoundException("Id Type of Service", "idTypeService", idTypeService)
                );
    }

    /**
     * Created type of service
     *
     * @param typeServiceResponseDTO: type @{@link TypeServiceResponseDTO}
     */
    public void addTypeService(TypeServiceResponseDTO typeServiceResponseDTO) {
        if (this.typeSvcREPO.existsByName(typeServiceResponseDTO.getName())) {
            throw new GlobalAppException(HttpStatus.BAD_REQUEST, 4029, utilsCommons.getMessage("field.name.service.type"));
        }
        TypeService typeService = utilsCommons.convertDTOToEntity(typeServiceResponseDTO, TypeService.class);
        typeService.setActive(true);
        this.typeSvcREPO.save(typeService);
    }

    /**
     * Update type of service
     *
     * @param typeServiceResponseDTO: type @{@link TypeServiceResponseDTO}
     */
    @Transactional(propagation = Propagation.SUPPORTS)
    public void updateTypeService(Long idTypeSvr, TypeServiceResponseDTO typeServiceResponseDTO) {
        TypeService typeService = this.getTypeService(idTypeSvr);
        if (typeService.getName() != typeServiceResponseDTO.getName()) {
            if (this.typeSvcREPO.existsByName(typeServiceResponseDTO.getName())) {
                throw new GlobalAppException(HttpStatus.BAD_REQUEST, 4029, utilsCommons.getMessage("field.name.service.type"));
            }
        }
        typeService.setName(typeServiceResponseDTO.getName());
        typeService.setDescription(typeServiceResponseDTO.getDescription());
        this.typeSvcREPO.save(typeService);
    }

    /**
     * Delete Type of Service with id
     *
     * @param idTypeSvr: type @{@link Long}
     */
    @Transactional(propagation = Propagation.SUPPORTS)
    public void deleteTypeServiceLogical(Long idTypeSvr) {
        TypeService typeService = this.getTypeService(idTypeSvr);
        typeService.setActive(false);
        this.typeSvcREPO.save(typeService);
    }

    @Transactional
    public void activeTypeServiceLogical(Long idTypeSvr) {
        TypeService typeService = this.getTypeService(idTypeSvr);
        typeService.setActive(true);
        this.typeSvcREPO.save(typeService);
    }

}
