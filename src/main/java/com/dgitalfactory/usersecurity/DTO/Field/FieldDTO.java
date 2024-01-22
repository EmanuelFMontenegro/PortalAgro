package com.dgitalfactory.usersecurity.DTO.Field;

import com.dgitalfactory.usersecurity.entity.Address;
import com.dgitalfactory.usersecurity.entity.Contact;
import lombok.*;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 05/12/2023 - 08:41
 */
@Data
@NoArgsConstructor
@Builder
public class FieldDTO {
    private Long id;
    private String name;
    private float dimensions;
    private String observation;
    private String geolocation;
    private Address address;
    private Contact contact;
    private Long person_id;
    private Boolean active;

    public FieldDTO(Long id, String name, float dimensions, String observation,
                    String geolocation, Address address, Contact contact,
                    Long person_id, Boolean active) {
        this.id = id;
        this.name = name;
        this.dimensions = dimensions;
        this.observation = observation;
        this.geolocation = geolocation;
        this.address = address;
        this.contact=contact;
        this.person_id = person_id;
        this.active = active;
    }
}
