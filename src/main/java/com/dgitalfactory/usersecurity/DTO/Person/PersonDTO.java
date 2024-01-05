package com.dgitalfactory.usersecurity.DTO.Person;

import com.dgitalfactory.usersecurity.DTO.AddressDTO;
import com.dgitalfactory.usersecurity.DTO.ContactDTO;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Data
@NoArgsConstructor
@Builder
public class PersonDTO {
    private Long id;
    @Size(min=3,max = 20)
    @NotBlank
    private String name;

    @Size(min=3,max = 20)
    @NotBlank
    private String lastname;

    @Size(min=7,max = 10)
    @NotBlank
    private String dniCuit;

    @Size(max = 150)
    private String descriptions;

    private AddressDTO addressDTO;

    private ContactDTO contactDTO;

    public PersonDTO(Long id, String name, String lastname, String dniCuit, String descriptions, AddressDTO addressDTO, ContactDTO contactDTO) {
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.dniCuit = dniCuit;
        this.descriptions = descriptions;
        this.addressDTO = addressDTO;
        this.contactDTO = contactDTO;
    }
}
