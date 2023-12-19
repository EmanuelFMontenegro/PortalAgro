package com.dgitalfactory.usersecurity.DTO.AppService;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 19/12/2023 - 09:25
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductApSvrDTO extends ServiceReportDTO{
    private String productName;
    private LocalDateTime flightTime;
    private float sprayArea;
    private String pilotName;
    private String idDrone;
}
