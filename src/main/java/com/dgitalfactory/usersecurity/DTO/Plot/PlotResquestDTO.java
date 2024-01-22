package com.dgitalfactory.usersecurity.DTO.Plot;

import com.dgitalfactory.usersecurity.DTO.custom_validator.IsFloatValid;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 17/01/2024 - 12:03
 */
@Data
@NoArgsConstructor
public class PlotResquestDTO {
    private Long id;
    private String name;
    private float dimensions;
    private String descriptions;
    private boolean active;

    public PlotResquestDTO(Long id, String name, float dimensions, String descriptions, boolean active) {
        this.id = id;
        this.name = name;
        this.dimensions = dimensions;
        this.descriptions = descriptions;
        this.active=active;
    }
}
