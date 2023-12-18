package com.dgitalfactory.usersecurity.entity.AppServices;

import com.dgitalfactory.usersecurity.entity.Field;
import com.dgitalfactory.usersecurity.utils.StatusService;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 14/12/2023 - 11:53
 */
@Data
@NoArgsConstructor
@Entity
@Table
public class ImagesSvr extends ServiceType{

    @Column(nullable = true, length = 60)
    private String name;
    @Builder
    public ImagesSvr(Long id, LocalDateTime dateOfService, String observations, StatusService status, Field field, String name) {
        super(id, dateOfService, observations, status, field);
        this.name = name;
    }
}
