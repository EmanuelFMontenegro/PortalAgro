package com.dgitalfactory.usersecurity.entity.AppServices;

import com.dgitalfactory.usersecurity.entity.Fields.Field;
import com.dgitalfactory.usersecurity.entity.Fields.Plot;
import com.dgitalfactory.usersecurity.utils.enums.StatusService;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 04/12/2023 - 08:45
 */

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class RequestService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate dateOfService;

    @Column(nullable = true, length = 255)
    private String observations;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusService status;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "plot_id", nullable = false)
    private Plot plot;

    @Column(nullable = true)
    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ServiceReport> listServiceReport = new ArrayList<>();

    @ManyToOne(cascade = CascadeType.PERSIST,fetch = FetchType.EAGER)
    @JoinColumn(name = "typeService_id", referencedColumnName = "id", nullable = true)
    private TypeService typeService;
}


