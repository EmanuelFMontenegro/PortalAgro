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
@Data@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TypePlantationResponseDTO {
    @Size(min = 3, max = 30)
    String name;
    @Size(max = 300)
    String description;
}
