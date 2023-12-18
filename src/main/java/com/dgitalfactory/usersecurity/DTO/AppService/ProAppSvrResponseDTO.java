package com.dgitalfactory.usersecurity.DTO.AppService;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 18/12/2023 - 09:45
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProAppSvrResponseDTO extends ServiceTypeResponseDTO{
    private String productName;
    private LocalDateTime flightTime;
    private float sprayArea;
    private String pilotName;
    private String idDrone;
}
