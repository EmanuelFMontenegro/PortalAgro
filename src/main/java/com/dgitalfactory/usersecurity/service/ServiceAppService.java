package com.dgitalfactory.usersecurity.service;

import com.dgitalfactory.usersecurity.DTO.AppService.ServiceAppDTO;
import com.dgitalfactory.usersecurity.DTO.AppService.ServiceAppResponseDTO;
import com.dgitalfactory.usersecurity.DTO.ResponsePaginationDTO;
import com.dgitalfactory.usersecurity.entity.AppServices.ServiceApp;
import com.dgitalfactory.usersecurity.entity.AppServices.TypeService;
import com.dgitalfactory.usersecurity.entity.Field;
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
     * @return @{@link List< ServiceApp >}
     */
    private List<ServiceApp> getAppServies(){
        return this.serviceREPO.findAll();
    }

    /**
     *
     * @param pageNo: type {@link Integer}
     * @param pageSize: type {@link Integer}
     * @param sortBy: type {@link String}
     * @param sortDir: type {@link String}
     * @return @{@link ResponsePaginationDTO}
     */
    public ResponsePaginationDTO<Object> getAllServiceUsers(int pageNo, int pageSize, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<ServiceApp> listPage = this.serviceREPO.findAll(pageable);
        List<ServiceApp> list = listPage.getContent();
        List<ServiceAppDTO> listDTO = utilsCommons.mapListEntityDTO(list, ServiceAppDTO.class);
        return ResponsePaginationDTO.builder()
                .list(Collections.singletonList(listDTO))
                .pageNo(listPage.getNumber())
                .pageSize(listPage.getSize())
                .pageTotal(listPage.getTotalPages())
                .itemsTotal(listPage.getTotalPages())
                .pageLast(listPage.isLast())
                .build();
    }

    /**
     * Created order service
     * @param field_id: type {@link Long} field id
     * @param serviceResponseDTO: type {@link ServiceAppResponseDTO}
     */
    @Transactional()
    public void addServiceApp(Long field_id, ServiceAppResponseDTO serviceResponseDTO){
        Field field = this.fieldService.getFieldById(field_id);
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
     * @param serviceApp_id: type {@link Long}
     * @return @{@link ServiceApp}
     */
    public ServiceApp getServiceById(Long serviceApp_id){
        return this.serviceREPO.findById(serviceApp_id)
                .orElseThrow(
                        ()-> errorSVC.getResourceNotFoundException("Service ID", "serviceApp_id", serviceApp_id)
                );
    }

    /**
     * Find Service by Id
     * @param field_id: type {@link Long} field id
     * @param serviceApp_id: type {@link Long} Service id
     * @return @{@link ServiceAppDTO}
     */
    public ServiceAppDTO getServiceAppDTO(Long field_id, Long serviceApp_id){
        if(!this.fieldService.existsField(serviceApp_id)){
            throw errorSVC.getResourceNotFoundException("Field ID","field_id", field_id);
        }
        ServiceApp serviceApp = this.getServiceById(serviceApp_id);

       return utilsCommons.convertEntityToDTO(serviceApp, ServiceAppDTO.class);
    }
}
