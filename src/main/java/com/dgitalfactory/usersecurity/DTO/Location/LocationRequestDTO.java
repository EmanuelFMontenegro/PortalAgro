package com.dgitalfactory.usersecurity.DTO.Location;

import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 09/01/2024 - 08:26
 */
@Data
@NoArgsConstructor
@Builder
public class LocationRequestDTO {
    private Long id;
    private String name;
    public LocationRequestDTO(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public void setName(@NotNull String name) {
        this.name = UtilsCommons.capitalizeAllFirstLetters(name);
    }
}
