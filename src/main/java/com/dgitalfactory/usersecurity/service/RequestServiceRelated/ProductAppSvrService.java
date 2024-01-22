package com.dgitalfactory.usersecurity.service.RequestServiceRelated;

import com.dgitalfactory.usersecurity.repository.RequestServices.ProductApSvrRepository;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 18/12/2023 - 09:40
 */
@Service
public class ProductAppSvrService {

    @Autowired
    private ProductApSvrRepository productSvrREPO;

    @Autowired
    private UtilsCommons utilsCommons;


//    public ResponsePaginationDTO getAllProductAppSvrUsers(int pageNo, int pageSize, String sortBy, String sortDir) {
//            Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
//                    ? Sort.by(sortBy).ascending()
//                    : Sort.by(sortBy).descending();
//            Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
//
//            Page<ProductApSvr> listField = this.productSvrREPO.findAll(pageable);
//            List<ProductApSvr> list = listField.getContent();
//            List<ProductAplicationSvrDTO> listDTO = utilsCommons.mapListEntityDTO(list, ProductAplicationSvrDTO.class);
//            return ResponsePaginationDTO.builder()
//                    .list(Collections.singletonList(listDTO))
//                    .pageNo(listField.getNumber())
//                    .pageSize(listField.getSize())
//                    .pageTotal(listField.getTotalPages())
//                    .itemsTotal(listField.getTotalPages())
//                    .pageLast(listField.isLast())
//                    .build();
//        }

}
