package com.dgitalfactory.usersecurity.DTO.AppService;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 19/12/2023 - 10:39
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TypeServiceDTO {
    private Long id;
    private String name;
    private String description;
}
