package com.dgitalfactory.usersecurity.controller.service_app;

import com.dgitalfactory.usersecurity.service.ProductAppSvrService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 18/12/2023 - 09:31
 */
@RestController
@Validated
@CrossOrigin
@RequestMapping("/api")
public class ProductApSvrController {

    @Autowired
    private ProductAppSvrService productAppSvrService;

//    @PreAuthorize("hasRole('ADMIN')")
//    @GetMapping("/user/field/product_aplication")
//    public ResponseEntity<ResponsePaginationDTO> getAllProductAppSvrUsers(
//            @RequestParam(value = "pageNo", defaultValue = AppConstants.PAGE_NUMBER_DEFAULT, required = false) int pageNumber,
//            @RequestParam(value = "pageSize", defaultValue = AppConstants.PAGE_SIZE_DEFAULT, required = false) int pageSize,
//            @RequestParam(value = "sortBy", defaultValue = AppConstants.ORDER_BY_DEFAULT, required = false) String sortBy,
//            @RequestParam(value = "sortDir", defaultValue = AppConstants.ORDER_DIR_DEFAULT, required = false) String sortDir) {
//
//        return new ResponseEntity<ResponsePaginationDTO>(
//                this.productAppSvrService.getAllProductAppSvrUsers(pageNumber, pageSize, sortBy, sortDir), HttpStatus.OK);
//    }

//    @PreAuthorize("hasRole('ADMIN') or @conditionEvaluatorService.canPreAuthAdmin(#user_id)")
//    @PostMapping("/user/{user_id}/field/{field_id}/service/product_application")
//    public ResponseEntity<MessageDTO> addField(@PathVariable("user_id") Long user_id,
//                                               @PathVariable("field_id") Long field_id,
//                                               @Valid @RequestBody FieldResponseDTO field) {
//        this.productAppSvrService.addProductApp(user_id, field_id,);
//        return ResponseEntity.ok(
//                MessageDTO.builder().code(2001)
//                        .message(utilsCommons.getStatusMessage(2001))
//                        .details("Campo")
//                        .build()
//        );
//    }
}
