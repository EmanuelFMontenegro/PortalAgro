package com.dgitalfactory.usersecurity.entity.Location.externalApi;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 05/01/2024 - 12:16
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LocationResponse {
    private int cantidad;
    private int inicio;
    private List<LocationExternal> localidades;
    private Parametros parametros;
    private int total;
}
