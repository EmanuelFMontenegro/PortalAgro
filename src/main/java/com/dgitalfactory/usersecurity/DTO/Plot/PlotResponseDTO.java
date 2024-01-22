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
    @Size(min = 5 , max = 30)
    @NotBlank
    private String name;

    @NotNull
    @DecimalMax(value = "1000000", inclusive = false)
    @DecimalMin(value = "0.0", inclusive = false)
    @Digits(integer=7, fraction=2)
    @IsFloatValid
    private float dimensions;

    @Size(max = 255)
    String descriptions;
}
