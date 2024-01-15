package com.dgitalfactory.usersecurity.security.dto;

import com.dgitalfactory.usersecurity.utils.enums.RoleName;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Data
@Builder
@NoArgsConstructor
public class RoleResponseDTO {

    private Long id;
    private String name;

    public RoleResponseDTO(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}


