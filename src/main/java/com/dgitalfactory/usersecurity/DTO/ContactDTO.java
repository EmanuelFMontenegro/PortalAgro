package com.dgitalfactory.usersecurity.DTO;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContactDTO {
//    private Long id;
    @Size(min=10,max = 12)
    private String movilPhone;

    @Size(min=10,max = 12)
    private String telephone;
}
