package com.dgitalfactory.usersecurity.service;

import com.dgitalfactory.usersecurity.DTO.AppService.ServiceAppDTO;
import com.dgitalfactory.usersecurity.DTO.ResponsePaginationDTO;
import com.dgitalfactory.usersecurity.entity.AppServices.ServiceApp;
import com.dgitalfactory.usersecurity.entity.AppServices.TypeService;
import com.dgitalfactory.usersecurity.repository.ServiceRepository;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 19/12/2023 - 09:13
 */
@Service
public class ServiceAppService {

    @Autowired
    private ServiceRepository serviceREPO;

    @Autowired
    private UtilsCommons utilsCommons;

    /**
     * Find all type service
     * @return @{@link List< ServiceApp >}
     */
    private List<ServiceApp> getAppServies(){
        return this.serviceREPO.findAll();
    }

    public ResponsePaginationDTO getAllServiceUsers(int pageNo, int pageSize, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<ServiceApp> listField = this.serviceREPO.findAll(pageable);
        List<ServiceApp> list = listField.getContent();
        List<ServiceAppDTO> listDTO = utilsCommons.mapListEntityDTO(list, ServiceAppDTO.class);
        return ResponsePaginationDTO.builder()
                .list(Collections.singletonList(listDTO))
                .pageNo(listField.getNumber())
                .pageSize(listField.getSize())
                .pageTotal(listField.getTotalPages())
                .itemsTotal(listField.getTotalPages())
                .pageLast(listField.isLast())
                .build();
    }
}
