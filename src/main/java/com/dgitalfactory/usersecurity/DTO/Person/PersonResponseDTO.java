package com.dgitalfactory.usersecurity.DTO.Person;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Data
@NoArgsConstructor
@Builder
public class PersonResponseDTO {
    private Long id;
    private String name;
    private String lastname;
    private String dniCuit;
    private String descriptions;
    private String location;
    private String telephone;

    public PersonResponseDTO(Long id, String name, String lastname, String dniCuit, String descriptions, String location, String telephone) {
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.dniCuit = dniCuit;
        this.descriptions = descriptions;
        this.location = location;
        this.telephone = telephone;
    }
}
