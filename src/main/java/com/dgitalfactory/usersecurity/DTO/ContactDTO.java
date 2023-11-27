package com.dgitalfactory.usersecurity.DTO;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ContactDTO {
    private Long id;

    @Size(min=10,max = 12)
    private String movilPhone;

    @Size(min=10,max = 12)
    private String telephone;
}
