package com.dgitalfactory.usersecurity.DTO;

import com.dgitalfactory.usersecurity.DTO.custom_validator.IsFloatValid;
import com.dgitalfactory.usersecurity.utils.NumberUtils;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import jakarta.validation.constraints.*;
import lombok.*;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 05/12/2023 - 08:41
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FieldResponseDTO {
    @Size(min = 3, max = 30)
    @NotBlank
    private String name;

    @NotNull
    @DecimalMax(value = "1000000", inclusive = false)
    @DecimalMin(value = "0.0", inclusive = false)
    @Digits(integer=7, fraction=2)
    @IsFloatValid
    private float dimensions;

    @Size(min = 0, max = 255)
    private String description;

    @Size(min = 0, max = 255)
    private String geolocation;

    private AddressDTO address;


    public void setName(@NotNull String name) {
        this.name = UtilsCommons.capitalizeAllFirstLetters(name);
    }
    public void setDescription(@NotNull String description) {
        this.description = UtilsCommons.capitalize(description);
    }

}
