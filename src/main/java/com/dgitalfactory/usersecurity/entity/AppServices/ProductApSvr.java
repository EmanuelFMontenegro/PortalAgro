package com.dgitalfactory.usersecurity.entity.AppServices;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Entity(name = "product_applications")
public class ProductApSvr extends ServiceReport {

    @Column(nullable = true, length = 60)
    private String productName;
    @Column(nullable = true)
    private LocalDateTime flightTime;
    @Column(nullable = true)
    private float sprayArea;
    @Column(nullable = true, length = 60)
    private String pilotName;
    @Column(nullable = true, length = 60)
    private String idDrone;

    @Builder
    public ProductApSvr(Long id, ServiceApp service, String productName, LocalDateTime flightTime, float sprayArea, String pilotName, String idDrone) {
        super(id, service);
        this.productName = productName;
        this.flightTime = flightTime;
        this.sprayArea = sprayArea;
        this.pilotName = pilotName;
        this.idDrone = idDrone;
    }
}
