package com.dgitalfactory.usersecurity.service;

import com.dgitalfactory.usersecurity.DTO.AppService.ServiceAppDTO;
import com.dgitalfactory.usersecurity.DTO.AppService.ServiceAppResponseDTO;
import com.dgitalfactory.usersecurity.DTO.ResponsePaginationDTO;
import com.dgitalfactory.usersecurity.entity.AppServices.ServiceApp;
import com.dgitalfactory.usersecurity.entity.AppServices.TypeService;
import com.dgitalfactory.usersecurity.entity.Field;
import com.dgitalfactory.usersecurity.exception.GlobalAppException;
import com.dgitalfactory.usersecurity.exception.GlobalMessageException;
import com.dgitalfactory.usersecurity.repository.ServiceRepository;
import com.dgitalfactory.usersecurity.utils.StatusService;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
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
 * @created 19/12/2023 - 09:13
 */
@Service
public class ServiceAppService {

    private static final Logger log = LoggerFactory.getLogger(ServiceAppService.class);

    @Autowired
    private ServiceRepository serviceREPO;

    @Autowired
    private FieldService fieldService;

    @Autowired
    private TypeSvcService typeSvcService;

    @Autowired
    private UtilsCommons utilsCommons;

    @Autowired
    private CustomeErrorService errorSVC;

    /**
     * Find all type service
     *
     * @return @{@link List< ServiceApp >}
     */
    private List<ServiceApp> getAppServies() {
        return this.serviceREPO.findAll();
    }

    /**
     * @param pageNo:   type {@link Integer}
     * @param pageSize: type {@link Integer}
     * @param sortBy:   type {@link String}
     * @param sortDir:  type {@link String}
     * @return @{@link ResponsePaginationDTO}
     */
    public ResponsePaginationDTO<Object> getAllService(int pageNo, int pageSize, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<ServiceAppDTO> listPage = this.serviceREPO.findAllServiceDTOByStatus(StatusService.PENDIENTE, pageable);
        List<ServiceAppDTO> list = listPage.getContent();
//        List<ServiceAppDTO> listDTO = utilsCommons.mapListEntityDTO(list, ServiceAppDTO.class);
        return ResponsePaginationDTO.builder()
                .list(Collections.singletonList(list))
                .pageNo(listPage.getNumber())
                .pageSize(listPage.getSize())
                .pageTotal(listPage.getTotalPages())
                .itemsTotal(listPage.getTotalPages())
                .pageLast(listPage.isLast())
                .build();
    }

    /**
     * @param pageNo:   type {@link Integer}
     * @param pageSize: type {@link Integer}
     * @param sortBy:   type {@link String}
     * @param sortDir:  type {@link String}
     * @param field_id: type {@link Long} field ID
     * @param user_id:  type {@link Long} user ID
     * @return @{@link ResponsePaginationDTO}
     */
    public ResponsePaginationDTO<Object> getAllServiceByUser(int pageNo, int pageSize, String sortBy, String sortDir,
                                                             Long field_id, Long user_id) {
        if (!this.serviceREPO.existsByFieldIdAndStatus(field_id, user_id, StatusService.PENDIENTE)) {
            throw new GlobalAppException(HttpStatus.NOT_FOUND, 2006, utilsCommons.getMessage("field.name.field.service"));
        }

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<ServiceAppDTO> listPage = this.serviceREPO.findAllServiceDTOByFieldIdAndStatus(field_id, StatusService.PENDIENTE, pageable);
        List<ServiceAppDTO> list = listPage.getContent();

        return ResponsePaginationDTO.builder()
                .list(Collections.singletonList(list))
                .pageNo(listPage.getNumber())
                .pageSize(listPage.getSize())
                .pageTotal(listPage.getTotalPages())
                .itemsTotal(listPage.getTotalPages())
                .pageLast(listPage.isLast())
                .build();
    }

    /**
     * Created order service
     *
     * @param field_id:           type {@link Long} field id
     * @param user_id:            type {@link Long} user id
     * @param serviceResponseDTO: type {@link ServiceAppResponseDTO}
     */
    @Transactional
    public void addServiceApp(Long user_id, Long field_id, ServiceAppResponseDTO serviceResponseDTO) {
        Field field = this.fieldService.getFieldById(field_id);
        this.fieldService.verifyExistsFieldUser(field_id, user_id);
        TypeService typeService = this.typeSvcService.getTypeService(serviceResponseDTO.getIdTypeService());
        ServiceApp serviceApp = ServiceApp.builder()
                .dateOfService(serviceResponseDTO.getDateOfService())
                .observations(serviceResponseDTO.getObservations())
                .status(StatusService.PENDIENTE)
                .typeService(typeService)
                .field(field)
                .build();

        this.serviceREPO.save(serviceApp);
    }

    /**
     * Find Service by Id
     *
     * @param serviceApp_id: type {@link Long}
     * @return @{@link ServiceApp}
     */
    public ServiceApp getServiceById(Long serviceApp_id) {
        return this.serviceREPO.findById(serviceApp_id)
                .orElseThrow(
                        () -> errorSVC.getResourceNotFoundException("Service ID", "serviceApp_id", serviceApp_id)
                );
    }

    /**
     * Find Service by Id
     *
     * @param serviceApp_id: type {@link Long}
     * @return @{@link ServiceAppDTO}
     */
    public ServiceAppDTO getServiceDTOById(Long serviceApp_id) {
        return this.serviceREPO.findServiceDTOById(serviceApp_id)
                .orElseThrow(
                        () -> errorSVC.getResourceNotFoundException("Service ID", "serviceApp_id", serviceApp_id)
                );
    }

    /**
     * Check if field and service exists
     *
     * @param field_id:      type {@link Long}
     * @param serviceApp_id: type {@link Long}
     */
    private void verifyExistsFieldService(Long field_id, Long serviceApp_id) {
        if (!this.fieldService.existsField(field_id)) {
            throw errorSVC.getResourceNotFoundException("Field ID", "field_id", field_id);
        } else if (!this.serviceREPO.existsServiceIdWithFieldId(field_id, serviceApp_id)) {
            throw new GlobalMessageException(
                    HttpStatus.NOT_FOUND, 4033,
                    utilsCommons.getFormatMessage(
                            utilsCommons.getStatusMessage(4033),
                            utilsCommons.getMessage("field.name.field"),
                            utilsCommons.getMessage("field.name.field.service")
                    ),
                    utilsCommons.getMessage("field.name.field.service"));
        }
    }

    /**
     * Delete Service by Id
     *
     * @param field_id:      type {@link Long} field ID
     * @param user_id:       type {@link Long} user ID
     * @param serviceApp_id: type {@link Long} Service ID
     */
    public void deleteServiceAppDTO(Long user_id, Long field_id, Long serviceApp_id) {
        this.verifyExistsFieldService(field_id, serviceApp_id);
        this.fieldService.existsFieldIdByUserId(field_id, user_id);
        this.serviceREPO.deleteById(serviceApp_id);
    }

    /**
     * Find Service by Id
     *
     * @param field_id:      type {@link Long} field id
     * @param user_id:       type {@link Long} user id
     * @param serviceApp_id: type {@link Long} Service id
     * @return @{@link ServiceAppDTO}
     */
    public ServiceAppDTO getServiceAppDTO(Long user_id, Long field_id, Long serviceApp_id) {
        this.verifyExistsFieldService(field_id, serviceApp_id);
        this.fieldService.verifyExistsFieldUser(field_id, user_id);
        return this.getServiceDTOById(serviceApp_id);
    }

    /**
     * Update service info
     *
     * @param user_id:               type {@link Long} user ID
     * @param field_id:              type {@link Long} field ID
     * @param serviceApp_id:         type {@link Long} service ID
     * @param serviceAppResponseDTO: type @{@link ServiceAppResponseDTO}
     */
    @Transactional
    public void updateService(Long user_id, Long field_id, Long serviceApp_id, ServiceAppResponseDTO serviceAppResponseDTO) {
        this.verifyExistsFieldService(field_id, serviceApp_id);
        this.fieldService.verifyExistsFieldUser(field_id, user_id);
        ServiceApp serviceApp = this.getServiceById(serviceApp_id);
        serviceApp.setDateOfService(serviceAppResponseDTO.getDateOfService());
        serviceApp.setObservations(serviceAppResponseDTO.getObservations());
        TypeService typeService = this.typeSvcService.getTypeService(serviceAppResponseDTO.getIdTypeService());
        serviceApp.setTypeService(typeService);
        this.serviceREPO.save(serviceApp);
    }
}
