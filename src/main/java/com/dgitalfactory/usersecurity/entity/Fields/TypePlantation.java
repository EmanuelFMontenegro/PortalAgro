package com.dgitalfactory.usersecurity.entity.Fields;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 17/01/2024 - 11:23
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "types_plantations", uniqueConstraints = {@UniqueConstraint(columnNames = {"name"})})
public class TypePlantation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Column(length = 30, nullable = false)
    String name;
    @Column(columnDefinition = "TEXT", nullable = true)
    String description;
    Boolean active;
}
