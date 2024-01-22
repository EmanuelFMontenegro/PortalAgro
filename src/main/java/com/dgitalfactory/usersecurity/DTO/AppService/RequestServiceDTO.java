package com.dgitalfactory.usersecurity.DTO.AppService;

import com.dgitalfactory.usersecurity.utils.enums.StatusService;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 19/12/2023 - 09:15
 */
@Data
@NoArgsConstructor
public class RequestServiceDTO {
    private Long id;
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dateOfService;
    private String observations;
    private StatusService status;
    private Long typeService_id;
    private Long plot_id;

    public RequestServiceDTO(Long id, LocalDate dateOfService, String observations, StatusService status, Long typeService_id, Long plot_id) {
        this.id = id;
        this.dateOfService = dateOfService;
        this.observations = observations;
        this.status = status;
        this.typeService_id = typeService_id;
        this.plot_id = plot_id;
    }
}
