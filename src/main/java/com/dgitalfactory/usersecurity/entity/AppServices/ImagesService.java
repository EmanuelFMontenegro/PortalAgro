package com.dgitalfactory.usersecurity.entity.AppServices;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 14/12/2023 - 11:53
 */
@Data
@NoArgsConstructor
@Entity(name = "image_service")
public class ImagesService extends ServiceReport{

    @Column(nullable = true, length = 60)
    private String name;
    @Builder
    public ImagesService(Long id, RequestService service, String name) {
        super(id, service);
        this.name = name;
    }
}
