package com.dgitalfactory.usersecurity.DTO.Person;

import com.dgitalfactory.usersecurity.security.dto.UserResponseDTO;
import com.dgitalfactory.usersecurity.security.entity.Role;
import com.dgitalfactory.usersecurity.utils.enums.RoleName;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

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
    private String dniCuit;
    private String descriptions;
    private Long location_id;
    private String telephone;
    private UserResponseDTO userResponseDTO;

    public PersonUserResponseDTO(Long id, String name, String lastname, String dniCuit, String descriptions, Long location_id, String telephone, UserResponseDTO userResponseDTO) {
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.dniCuit = dniCuit;
        this.descriptions = descriptions;
        this.location_id = location_id;
        this.telephone = telephone;
        this.userResponseDTO = userResponseDTO;
    }
}
