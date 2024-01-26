package com.dgitalfactory.usersecurity.entity.Fields;

import com.dgitalfactory.usersecurity.entity.AppServices.RequestService;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 17/01/2024 - 12:03
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Plots")
public class Plot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 30, nullable = false)
    private String name;

    @Column(nullable = false)
    private Float dimensions;

    @Column(length = 255, nullable = true)
    String descriptions;

    @ManyToOne(cascade = CascadeType.PERSIST, fetch = FetchType.EAGER)
    @JoinColumn(name = "type_plantation_id", referencedColumnName = "id", nullable = true)
    private TypePlantation typePlantation;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "field_id", nullable = false)
    private Field field;

    @OneToMany(mappedBy = "plot", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<RequestService> services = new HashSet<>();

    private boolean active;
}
