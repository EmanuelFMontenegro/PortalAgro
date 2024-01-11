package com.dgitalfactory.usersecurity.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "people", uniqueConstraints = {@UniqueConstraint(columnNames = {"dniCuit"})})
public class Person {
    @Id
    private Long id;
    @Column(length = 20, nullable = true)
    private String name;
    @Column(length = 20, nullable = true)
    private String lastname;
    @Column(length = 11, nullable = true)
    private String dniCuit;
    @Column(length = 150, nullable = true)
    private String descriptions;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "address_id", referencedColumnName = "id", nullable = false)
    private Address address;

    @OneToOne(cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    @JoinColumn(name = "contact_id", referencedColumnName = "id", nullable = false)
    private Contact contact;

    @OneToMany(mappedBy = "person", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Field> fields = new HashSet<>();

}
