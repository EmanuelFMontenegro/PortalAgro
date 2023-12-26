package com.dgitalfactory.usersecurity.DTO.AppService;

import com.dgitalfactory.usersecurity.utils.StatusService;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 19/12/2023 - 09:15
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServiceAppDTO {
    private Long id;
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dateOfService;
    private String observations;
    private StatusService status;
    private Long typeService_id;
    private Long field_id;
}
