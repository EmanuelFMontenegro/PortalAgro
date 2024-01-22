package com.dgitalfactory.usersecurity.security.controller;

import com.dgitalfactory.usersecurity.DTO.MessageDTO;
import com.dgitalfactory.usersecurity.DTO.ResponsePaginationDTO;
import com.dgitalfactory.usersecurity.security.dto.UserMinResponseDTO;
import com.dgitalfactory.usersecurity.security.dto.UserResponseDTO;
import com.dgitalfactory.usersecurity.security.entity.Role;
import com.dgitalfactory.usersecurity.security.service.UserService;
import com.dgitalfactory.usersecurity.utils.AppConstants;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@RestController
@RequestMapping("/api/user")
@CrossOrigin
@Validated
@Tag(name = "Users", description = "Users Services")
public class UserConntroller {

    @Autowired
    private UserService userSVC;

    @Autowired
    private UtilsCommons utilsCommons;

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(this.userSVC.findUserDTO(id));
    }

    @GetMapping("")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponsePaginationDTO> getAllUsers(
            @RequestParam(value = "pageNo", defaultValue = AppConstants.PAGE_NUMBER_DEFAULT, required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = AppConstants.PAGE_SIZE_DEFAULT, required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = AppConstants.ORDER_BY_DEFAULT, required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = AppConstants.ORDER_DIR_DEFAULT, required = false) String sortDir,
            @RequestParam(value = "email", defaultValue = "", required = false) String email

    ) {
        return ResponseEntity.ok(this.userSVC.getAllUsers(pageNumber, pageSize, sortBy, sortDir, email));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDTO> deleteUserById(@PathVariable("id") Long id) {
        this.userSVC.deleteLogicalUserById(id);
        return ResponseEntity.ok(
                MessageDTO.builder()
                        .code(2003)
                        .message(utilsCommons.getStatusMessage(2003))
                        .details(utilsCommons.getMessage("field.name.user"))
                        .build()
        );
    }

    @DeleteMapping("/{id}/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDTO> deleteUserByIdADMIN(@PathVariable("id") Long id) {
        this.userSVC.deleteDefinitiveUserById(id);
        return ResponseEntity.ok(
                MessageDTO.builder()
                        .code(2003)
                        .message(utilsCommons.getStatusMessage(2003))
                        .details(utilsCommons.getMessage("field.name.user"))
                        .build()
        );
    }
}
