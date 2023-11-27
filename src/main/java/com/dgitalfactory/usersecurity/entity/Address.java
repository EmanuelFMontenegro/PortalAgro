package com.dgitalfactory.usersecurity.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "address")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true, length = 30)
    private String streetName;
    @Column(nullable = false, length = 20)
    private String number;
    @Column(nullable = true, length = 30)
    private String getStreetName2;

    @Column(nullable = true, length = 30)
    private String province;
    @Column(nullable = true, length = 30)
    private String location;

    @Column(nullable = true, length = 255)
    private String observations;

    @OneToOne(mappedBy = "address")
    private Person person;

}
