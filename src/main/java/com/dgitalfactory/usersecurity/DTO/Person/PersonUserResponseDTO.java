package com.dgitalfactory.usersecurity.DTO.Person;

import com.dgitalfactory.usersecurity.security.dto.UserResponseDTO;
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
public class PersonUserResponseDTO {
    private Long id;
    private String name;
    private String lastname;
    private String dni;
    private String descriptions;
    private Long location_id;
    private String telephone;
    private UserResponseDTO userResponseDTO;

    public PersonUserResponseDTO(Long id, String name, String lastname, String dni, String descriptions, Long location_id, String telephone, UserResponseDTO userResponseDTO) {
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.dni = dni;
        this.descriptions = descriptions;
        this.location_id = location_id;
        this.telephone = telephone;
        this.userResponseDTO = userResponseDTO;
    }
}
