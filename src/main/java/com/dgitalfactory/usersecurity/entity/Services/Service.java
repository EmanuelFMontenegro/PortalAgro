package com.dgitalfactory.usersecurity.entity.Services;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 04/12/2023 - 08:45
 */

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "services")
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.EAGER)
    @JoinColumn(name = "tipo_servicio_id", referencedColumnName = "id")
    private ServiceType serviceType;

    @Column(nullable = false, length = 255)
    private String observations;

}
