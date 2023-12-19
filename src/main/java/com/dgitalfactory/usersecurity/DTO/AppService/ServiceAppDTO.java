package com.dgitalfactory.usersecurity.DTO.AppService;

import com.dgitalfactory.usersecurity.DTO.Field.FieldDTO;
import com.dgitalfactory.usersecurity.utils.StatusService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 19/12/2023 - 09:15
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServiceAppDTO {
    private Long id;
    private LocalDateTime dateOfService;
    private String observations;
    private StatusService status;
    private FieldDTO field;
    private List<ServiceReportDTO> listServiceReport;
}
