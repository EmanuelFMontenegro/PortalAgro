package com.dgitalfactory.usersecurity.DTO;

import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.validation.annotation.Validated;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Data
@NoArgsConstructor
public class AddressDTO {
//    private Long id;
    @Size(min=3,max = 255)
    @NotBlank
    private String address;

    @Size(min=3,max = 60)
    @NotBlank
    private String location;

    public void setAddress(String address) {
        this.address = UtilsCommons.capitalize(address);
    }

    public void setLocation(String location) {
        this.location = UtilsCommons.capitalize(location);
    }

    public AddressDTO(String address, String location) {
        this.address = address;
        this.location = location;
    }
}
