package com.dgitalfactory.usersecurity.security.entity;

import com.dgitalfactory.usersecurity.utils.RoleName;
import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
}


