package com.dgitalfactory.usersecurity.entity;

import jakarta.persistence.*;
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
//@Table(name = "person", uniqueConstraints = {@UniqueConstraint(columnNames = {"dni"})})
@Table(name = "people")
public class Person {
    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 60, nullable = true)
    private String name;
    @Column(length = 60, nullable = true)
    private String lastname;
    @Column(length = 13, nullable = true)
    private String dni;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "address_id", referencedColumnName = "id", nullable = true)
    private Address address;

    @OneToOne(cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    @JoinColumn(name = "contact_id", referencedColumnName = "id", nullable = true)
    private Contact contact;

    @OneToMany(mappedBy = "person")
    private Set<Field> fields = new HashSet<>();

}
