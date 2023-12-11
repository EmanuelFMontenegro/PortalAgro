package com.dgitalfactory.usersecurity.DTO.Person;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PersonResponseDTO {

    @Size(min=3,max = 60)
    @NotBlank
    private String name;

    @Size(min=3,max = 60)
    @NotBlank
    private String lastname;

    @Size(min=8,max = 13)
    @NotBlank
    private String dni;

}
