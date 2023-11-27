package com.dgitalfactory.usersecurity.DTO;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AddressDTO {

    @Size(min=3,max = 60)
    private String streetName;
    @Size(min=1,max = 60)
    private String number;
    @Size(min=3,max = 60)
    private String getStreetName2;

    @Size(min=3,max = 60)
    private String province;
    @Size(min=3,max = 60)
    private String location;

    @Size(min=3,max = 255)
    private String observations;
}
