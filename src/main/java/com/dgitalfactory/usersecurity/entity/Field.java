package com.dgitalfactory.usersecurity.entity;

import com.dgitalfactory.usersecurity.entity.AppServices.ServiceType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 04/12/2023 - 08:45
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
//@Table(name = "person", uniqueConstraints = {@UniqueConstraint(columnNames = {"dni"})})
@Table(name = "fields")
public class Field {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 60, nullable = false)
    private String name;

    @Column(nullable = false)
    private float dimensions;

    @Column(nullable = false)
    private String description;

    @Column(nullable = true)
    private String geolocation;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(referencedColumnName = "id", nullable = true)
    private Address address;

    @OneToOne(cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    @JoinColumn(referencedColumnName = "id", nullable = true)
    private Contact contact;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @OneToMany(mappedBy = "field", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ServiceType> services = new HashSet<>();
}
