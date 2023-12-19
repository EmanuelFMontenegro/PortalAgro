package com.dgitalfactory.usersecurity.entity.AppServices;

import com.dgitalfactory.usersecurity.entity.Field;
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
@Entity(name = "image_services")
public class ImagesSvr extends ServiceReport{

    @Column(nullable = true, length = 60)
    private String name;
    @Builder
    public ImagesSvr(Long id, ServiceApp service, String name) {
        super(id, service);
        this.name = name;
    }
}
