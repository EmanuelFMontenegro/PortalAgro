package com.dgitalfactory.usersecurity.DTO.AppService;

import com.dgitalfactory.usersecurity.DTO.Field.FieldDTO;
import com.dgitalfactory.usersecurity.utils.StatusService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 18/12/2023 - 09:34
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServiceTypeDTO {
    private Long id;

    private LocalDateTime dateOfService;

    private String observations;

    private StatusService status;

    private FieldDTO field;
}
