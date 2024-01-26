package com.dgitalfactory.usersecurity.DTO.Plot;

import com.dgitalfactory.usersecurity.DTO.custom_validator.IsFloatValid;
import com.dgitalfactory.usersecurity.utils.AppConstants;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 17/01/2024 - 12:03
 */
@Data
@NoArgsConstructor
public class PlotResponseDTO {
    private Long id;
    private String name;
    private float dimensions;
    private String descriptions;
    private boolean active;
    private Long type_plantation_id;

    public PlotResponseDTO(Long id, String name, float dimensions, String descriptions, boolean active, Long type_plantation_id) {
        this.id = id;
        this.name = name;
        this.dimensions = dimensions;
        this.descriptions = descriptions;
        this.active=active;
        this.type_plantation_id=type_plantation_id;
    }

}
