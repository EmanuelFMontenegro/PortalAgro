package com.dgitalfactory.usersecurity.DTO.TypePlantation;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 17/01/2024 - 11:23
 */
@Data
@NoArgsConstructor
@Builder
public class TypePlantationRequestDTO {
    Long id;
    String name;
    String description;
    Boolean active;

    public TypePlantationRequestDTO(Long id, String name, String description, Boolean active) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.active = active;
    }
}
