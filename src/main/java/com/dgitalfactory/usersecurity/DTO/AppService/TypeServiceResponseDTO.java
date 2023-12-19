package com.dgitalfactory.usersecurity.DTO.AppService;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 19/12/2023 - 10:39
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TypeServiceResponseDTO {
    @NotBlank
    @Size(min = 2, max = 60)
    private String name;
    @NotBlank
    @Size(min = 2, max = 255)
    private String description;
}
