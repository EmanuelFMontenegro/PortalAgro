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
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class ServiceType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 60, nullable = true)
    private String name;

    @Column(nullable = false, length = 255)
    private String description;
}


