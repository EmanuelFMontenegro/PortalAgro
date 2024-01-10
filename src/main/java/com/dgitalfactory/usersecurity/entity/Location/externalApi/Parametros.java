package com.dgitalfactory.usersecurity.entity.Location.externalApi;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 05/01/2024 - 12:17
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Parametros {
    private List<String> campos;
    private int max;
    private String provincia;
}
