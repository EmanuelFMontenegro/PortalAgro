package com.dgitalfactory.usersecurity.DTO.Field;

import com.dgitalfactory.usersecurity.DTO.AddressDTO;
import com.dgitalfactory.usersecurity.DTO.ContactDTO;
import lombok.*;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 05/12/2023 - 08:41
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FieldDTO {
    private Long id;
    private String name;
    private float dimensions;
    private String description;
    private String geolocation;
    private AddressDTO address;
    private ContactDTO contact;
//    private PersonDTO person;
}
