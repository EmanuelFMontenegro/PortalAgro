package com.dgitalfactory.usersecurity.security.entity;

import com.dgitalfactory.usersecurity.utils.enums.RoleName;
import jakarta.persistence.*;
import lombok.*;
/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Data
@Builder
@NoArgsConstructor
@Entity
@Table(name = "roles", uniqueConstraints = {@UniqueConstraint(columnNames = {"name"})})
public class Role {

    public Role(RoleName name) {
        this.name = name;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private RoleName name;

    public Role(Long id, RoleName name) {
        this.id = id;
        this.name = name;
    }
}


