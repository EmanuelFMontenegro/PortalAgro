package com.dgitalfactory.usersecurity.entity.Services;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 14/12/2023 - 11:53
 */
@Data
@NoArgsConstructor
@Entity
@Table
public class Images extends ServiceType{
    @Builder
    public Images(Long id, String name, String description) {
        super(id, name, description);
    }
}
