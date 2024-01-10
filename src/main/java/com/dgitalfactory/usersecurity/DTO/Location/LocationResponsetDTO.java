package com.dgitalfactory.usersecurity.DTO.Location;

import com.dgitalfactory.usersecurity.utils.AppConstants;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 09/01/2024 - 08:26
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LocationResponsetDTO {

    @NotNull
    @Size(min = AppConstants.LOCATION_NAME_MIN, max = AppConstants.LOCATION_NAME_MAX)
    private String name;
}
