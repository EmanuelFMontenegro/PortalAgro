package com.dgitalfactory.usersecurity.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "contact")
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true, length = 12)
    private String movilPhone;

    @Column(nullable = true, length = 12)
    private String telephone;

    @OneToOne(mappedBy = "contact")
    private Person person;
}
