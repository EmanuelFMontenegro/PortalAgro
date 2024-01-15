package com.dgitalfactory.usersecurity.DTO.Person;

import com.dgitalfactory.usersecurity.security.dto.UserResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 15/01/2024 - 13:14
 */
@Data
@NoArgsConstructor
@Builder
public class PersonUserProfile {
    private Long id;
    private String name;
    private String lastname;
    private String username;
    private String avatar;

    public PersonUserProfile(Long id, String name, String lastname, String username, String avatar) {
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.username = username;
        this.avatar = avatar;
    }
}
