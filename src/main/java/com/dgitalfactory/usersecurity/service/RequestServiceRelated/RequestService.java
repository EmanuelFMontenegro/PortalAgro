package com.dgitalfactory.usersecurity.service.RequestServiceRelated;

import org.springframework.stereotype.Service;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 19/12/2023 - 09:13
 */
@Service
public class RequestService {
//
//    private static final Logger log = LoggerFactory.getLogger(ServiceAppService.class);
//
//    @Autowired
//    private ServiceRepository serviceREPO;
//
//    @Autowired
//    private FieldService fieldService;
//
//    @Autowired
//    private TypeSvcService typeSvcService;
//
//    @Autowired
//    private UtilsCommons utilsCommons;
//
//    @Autowired
//    private CustomeErrorService errorSVC;
//
//    /**
//     * Find all type service
//     *
//     * @return @{@link List<   RequestService   >}
//     */
//    private List<RequestService> getAppServies() {
//        return this.serviceREPO.findAll();
//    }
//
//    /**
//     * @param pageNo:   type {@link Integer}
//     * @param pageSize: type {@link Integer}
//     * @param sortBy:   type {@link String}
//     * @param sortDir:  type {@link String}
//     * @return @{@link ResponsePaginationDTO}
//     */
//    public ResponsePaginationDTO<Object> getAllService(int pageNo, int pageSize, String sortBy, String sortDir) {
//        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
//                ? Sort.by(sortBy).ascending()
//                : Sort.by(sortBy).descending();
//        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
//
//        Page<RequestServiceDTO> listPage = this.serviceREPO.findAllServiceDTOByStatus(StatusService.PENDIENTE, pageable);
//        List<RequestServiceDTO> list = listPage.getContent();
////        List<ServiceAppDTO> listDTO = utilsCommons.mapListEntityDTO(list, ServiceAppDTO.class);
//        return ResponsePaginationDTO.builder()
//                .list(Collections.singletonList(list))
//                .pageNo(listPage.getNumber())
//                .pageSize(listPage.getSize())
//                .pageTotal(listPage.getTotalPages())
//                .itemsTotal(listPage.getTotalPages())
//                .pageLast(listPage.isLast())
//                .build();
//    }
//
//    /**
//     * @param pageNo:   type {@link Integer}
//     * @param pageSize: type {@link Integer}
//     * @param sortBy:   type {@link String}
//     * @param sortDir:  type {@link String}
//     * @param field_id: type {@link Long} field ID
//     * @param user_id:  type {@link Long} user ID
//     * @return @{@link ResponsePaginationDTO}
//     */
//    public ResponsePaginationDTO<Object> getAllServiceByUser(int pageNo, int pageSize, String sortBy, String sortDir,
//                                                             Long field_id, Long user_id) {
//        if (!this.serviceREPO.existsByFieldIdAndStatus(field_id, user_id, StatusService.PENDIENTE)) {
//            throw new GlobalAppException(HttpStatus.NOT_FOUND, 2006, utilsCommons.getMessage("field.name.field.service"));
//        }
//
//        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
//                ? Sort.by(sortBy).ascending()
//                : Sort.by(sortBy).descending();
//        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
//
//        Page<RequestServiceDTO> listPage = this.serviceREPO.findAllServiceDTOByFieldIdAndStatus(field_id, StatusService.PENDIENTE, pageable);
//        List<RequestServiceDTO> list = listPage.getContent();
//
//        return ResponsePaginationDTO.builder()
//                .list(Collections.singletonList(list))
//                .pageNo(listPage.getNumber())
//                .pageSize(listPage.getSize())
//                .pageTotal(listPage.getTotalPages())
//                .itemsTotal(listPage.getTotalPages())
//                .pageLast(listPage.isLast())
//                .build();
//    }
//
//    /**
//     * Check if the field service has the same service type on the given date
//     * @param field_id: type {@link Long} id field
//     * @param type_id: typq {@link Long} id type service
//     * @param date: type {@link LocalDate} date of the service
//     * @return @{@link Boolean}
//     */
//    private boolean checkDataService(Long field_id, Long type_id, LocalDate date){
//        return this.serviceREPO.checkDataService(field_id,type_id,date);
//    }
//
//    public boolean verifi(Long field_id, Long type_id, LocalDate date){
//            return this.serviceREPO.checkDataService(field_id,type_id,date);
//    }
//
//    /**
//     * Created order service
//     *
//     * @param field_id:           type {@link Long} field id
//     * @param user_id:            type {@link Long} user id
//     * @param serviceResponseDTO: type {@link RequestServiceResponseDTO}
//     */
//    @Transactional
//    public void addServiceApp(Long user_id, Long field_id, RequestServiceResponseDTO serviceResponseDTO) {
//        Field field = this.fieldService.getFieldById(field_id);
//        this.fieldService.verifyExistsFieldUser(field_id, user_id);
//        //VERIFICA FECHAS, QUE NO EXISTA SERVICIOS IGUALES EN LA MISMA FECHA
//        if (this.checkDataService(field_id, serviceResponseDTO.getIdTypeService(), serviceResponseDTO.getDateOfService())){
//            throw new GlobalAppException(HttpStatus.NOT_FOUND,4037,
//                    utilsCommons.getMessage("field.name.field.lote"));
//        }
//        TypeService typeService = this.typeSvcService.getTypeService(serviceResponseDTO.getIdTypeService());
//        RequestService requestService = RequestService.builder()
//                .dateOfService(serviceResponseDTO.getDateOfService())
//                .observations(serviceResponseDTO.getObservations())
//                .status(StatusService.PENDIENTE)
//                .typeService(typeService)
//                .field(field)
//                .build();
//
//        this.serviceREPO.save(requestService);
//    }
//
//    /**
//     * Find Service by Id
//     *
//     * @param serviceApp_id: type {@link Long}
//     * @return @{@link RequestService}
//     */
//    public RequestService getServiceById(Long serviceApp_id) {
//        return this.serviceREPO.findById(serviceApp_id)
//                .orElseThrow(
//                        () -> errorSVC.getResourceNotFoundException("Service ID", "serviceApp_id", serviceApp_id)
//                );
//    }
//
//    /**
//     * Find Service by Id
//     *
//     * @param serviceApp_id: type {@link Long}
//     * @return @{@link RequestServiceDTO}
//     */
//    public RequestServiceDTO getServiceDTOById(Long serviceApp_id) {
//        return this.serviceREPO.findServiceDTOById(serviceApp_id)
//                .orElseThrow(
//                        () -> errorSVC.getResourceNotFoundException("Service ID", "serviceApp_id", serviceApp_id)
//                );
//    }
//
//    /**
//     * Check if field and service exists
//     *
//     * @param field_id:      type {@link Long}
//     * @param serviceApp_id: type {@link Long}
//     */
//    private void verifyExistsFieldService(Long field_id, Long serviceApp_id) {
//        if (!this.fieldService.existsField(field_id)) {
//            throw errorSVC.getResourceNotFoundException("Field ID", "field_id", field_id);
//        } else if (!this.serviceREPO.existsServiceIdWithFieldId(field_id, serviceApp_id)) {
//            throw new GlobalMessageException(
//                    HttpStatus.NOT_FOUND, 4033,
//                    utilsCommons.getFormatMessage(
//                            utilsCommons.getStatusMessage(4033),
//                            utilsCommons.getMessage("field.name.field"),
//                            "field_id",
//                            utilsCommons.getMessage("field.name.field.service"),
//                            "service_id",
//                    ),
//                    utilsCommons.getMessage("field.name.field.service"));
//        }
//    }
//
//    /**
//     * Delete Service by Id
//     *
//     * @param field_id:      type {@link Long} field ID
//     * @param user_id:       type {@link Long} user ID
//     * @param serviceApp_id: type {@link Long} Service ID
//     */
//    public void deleteServiceAppDTO(Long user_id, Long field_id, Long serviceApp_id) {
//        this.verifyExistsFieldService(field_id, serviceApp_id);
//        this.fieldService.existsFieldIdByUserId(field_id, user_id);
//        log.info("CONSULTAR QUE HACER DESPUEST DE ESTO... SI SE PUEDE ELIMINAR SI LA FECHA ACTUAL" +
//                " ES ANTERIOR A LA FECHA DEL SERVICIO Y SI EL PEDIDO FUE APROBADO... " +
//                " QUE HACER?");
////        this.serviceREPO.deleteById(serviceApp_id);
//    }
//
//    /**
//     * Find Service by Id
//     *
//     * @param field_id:      type {@link Long} field id
//     * @param user_id:       type {@link Long} user id
//     * @param serviceApp_id: type {@link Long} Service id
//     * @return @{@link RequestServiceDTO}
//     */
//    public RequestServiceDTO getServiceAppDTO(Long user_id, Long field_id, Long serviceApp_id) {
//        this.verifyExistsFieldService(field_id, serviceApp_id);
//        this.fieldService.verifyExistsFieldUser(field_id, user_id);
//        return this.getServiceDTOById(serviceApp_id);
//    }
//
//    /**
//     * Update service info
//     *
//     * @param user_id:               type {@link Long} user ID
//     * @param field_id:              type {@link Long} field ID
//     * @param serviceApp_id:         type {@link Long} service ID
//     * @param requestServiceResponseDTO: type @{@link RequestServiceResponseDTO}
//     */
//    @Transactional
//    public void updateService(Long user_id, Long field_id, Long serviceApp_id, RequestServiceResponseDTO requestServiceResponseDTO) {
//        this.verifyExistsFieldService(field_id, serviceApp_id);
//        this.fieldService.verifyExistsFieldUser(field_id, user_id);
//        RequestService requestService = this.getServiceById(serviceApp_id);
//        //VERIFICA FECHAS, QUE NO EXISTA SERVICIOS IGUALES EN LA MISMA FECHA
//        if(!requestService.getDateOfService().equals(requestServiceResponseDTO.getDateOfService())){
//            if (this.checkDataService(field_id, requestServiceResponseDTO.getIdTypeService(), requestServiceResponseDTO.getDateOfService())){
//                throw new GlobalAppException(HttpStatus.NOT_FOUND,4037,
//                        utilsCommons.getMessage("field.name.field.lote"));
//            }
//        }
//        requestService.setDateOfService(requestServiceResponseDTO.getDateOfService());
//        requestService.setObservations(requestServiceResponseDTO.getObservations());
//        TypeService typeService = this.typeSvcService.getTypeService(requestServiceResponseDTO.getIdTypeService());
//        requestService.setTypeService(typeService);
//        this.serviceREPO.save(requestService);
//    }
}
