package com.dgitalfactory.usersecurity.DTO;

import com.dgitalfactory.usersecurity.entity.Address;
import com.dgitalfactory.usersecurity.entity.Contact;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PersonDTO {

    @Size(min=3,max = 60)
    @NotBlank
    private String name;

    @Size(min=3,max = 60)
    @NotBlank
    private String lastname;

    @Size(min=8,max = 13)
    @NotBlank
    private String dni;

    private AddressDTO addressDTO;

    private ContactDTO contactDTO;

    private Long userid;
}
