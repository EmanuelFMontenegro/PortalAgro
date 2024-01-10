package com.dgitalfactory.usersecurity.entity.Location.externalApi;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 05/01/2024 - 11:07
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LocationExternal {

    private String  id;

    @Column(nullable = true, length = 60)
    private String nombre;

}
