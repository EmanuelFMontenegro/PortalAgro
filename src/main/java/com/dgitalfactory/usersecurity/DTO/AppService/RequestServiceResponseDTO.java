package com.dgitalfactory.usersecurity.DTO.AppService;

import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
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
public class RequestServiceResponseDTO {
    @NotNull
    @Future(message = "{entity.type.service.dateOfService.future}")
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dateOfService;

    @NotNull
    @Size(max = 255)
    private String observations;

    @NotNull
    @Min(value=1, message = "{entity.type.service.idTypeService.min}")
    private Long idTypeService;

    public void setObservations(@NotNull String observations) {
        if(!observations.isEmpty()) {
            this.observations = UtilsCommons.capitalize(observations);
        }
    }

}
