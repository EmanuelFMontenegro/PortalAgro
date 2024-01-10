package com.dgitalfactory.usersecurity.DTO.Location;

import jakarta.persistence.*;
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
public class LocationDTO {
    private Long id;
    private String name;
}
