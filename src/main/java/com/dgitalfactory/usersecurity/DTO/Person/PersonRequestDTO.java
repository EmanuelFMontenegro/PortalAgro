package com.dgitalfactory.usersecurity.DTO.Person;

import com.dgitalfactory.usersecurity.utils.AppConstants;
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
public class PersonRequestDTO {

    @Size(min=AppConstants.NAME_LASTNAME_MIN,max = AppConstants.NAME_LASTNAME_MAX)
    @NotBlank
    private String name;

    @Size(min=AppConstants.NAME_LASTNAME_MIN,max = AppConstants.NAME_LASTNAME_MAX)
    @NotBlank
    private String lastname;

    @Size(min= AppConstants.DNI_MIN,max = AppConstants.CUIT_CUIL_MAX)
    @NotBlank
    private String dniCuit;

    @Size(max = 150)
    private String descriptions;

    @Size(min=3,max = 255)
    @NotBlank
    private String location;

    @Size(min=AppConstants.TELEPHONE_MIN,max = AppConstants.TELPHONE_MAX)
    @NotBlank
    private String telephone;

}
