package com.dgitalfactory.usersecurity.DTO.AppService;


import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    public void setName(@NotNull String name){
        this.name = UtilsCommons.capitalizeAllFirstLetters(name);
    }
    public void setDescription(@NotNull String description) {
        this.description = UtilsCommons.capitalize(description);
    }
}
