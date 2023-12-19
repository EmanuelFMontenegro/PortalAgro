package com.dgitalfactory.usersecurity.entity.AppServices;

import com.dgitalfactory.usersecurity.entity.Field;
import com.dgitalfactory.usersecurity.utils.StatusService;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 04/12/2023 - 08:45
 */

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "services")
public class ServiceApp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime dateOfService;

    @Column(nullable = true, length = 255)
    private String observations;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusService status = StatusService.PENDIENTE;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "field_id", nullable = false)
    @JsonIgnoreProperties("Service")
    private Field field;

    @Column(nullable = true)
    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<ServiceReport> listServiceReport;

//    @Column(name = false)
//    @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.EAGER)
//    private Type


}


