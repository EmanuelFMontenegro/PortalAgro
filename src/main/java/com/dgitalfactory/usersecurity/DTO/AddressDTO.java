package com.dgitalfactory.usersecurity.DTO;

import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

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

    @NotNull
    @Min(value=1)
    private Long location_id;

    public void setAddress(String address) {
        this.address = UtilsCommons.capitalize(address);
    }

    public AddressDTO(String address, Long location_id) {
        this.address = address;
        this.location_id = location_id;
    }
}
