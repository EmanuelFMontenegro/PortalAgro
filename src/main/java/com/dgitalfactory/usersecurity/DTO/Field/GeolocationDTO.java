package com.dgitalfactory.usersecurity.DTO.Field;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 07/12/2023 - 13:49
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeolocationDTO {
    @Size(min = 0, max = 255)
    @NotBlank
    private String geolocation;
}
