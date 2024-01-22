package com.dgitalfactory.usersecurity.repository.Fields;

import com.dgitalfactory.usersecurity.DTO.Plot.PlotResquestDTO;
import com.dgitalfactory.usersecurity.entity.Fields.Field;
import com.dgitalfactory.usersecurity.entity.Fields.Plot;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 18/01/2024 - 11:56
 */
public interface PlotRepository extends JpaRepository<Plot, Long> {

    @Query("SELECT NEW com.dgitalfactory.usersecurity.DTO.Plot.PlotResquestDTO(" +
            "p.id, p.name, p.dimensions, COALESCE(p.descriptions, ''), p.active" +
            ")" +
            " FROM Plot p " +
            " WHERE p.field.id= :field_id AND " +
            " p.active= :active")
    Page<PlotResquestDTO> findAllPlotResponseByFieldIdAndActive(@Param("field_id") Long field_id,
                                                    @Param("active") boolean active,
                                                    Pageable pageable);

    @Query("SELECT NEW com.dgitalfactory.usersecurity.DTO.Plot.PlotResquestDTO(" +
            "p.id, p.name, p.dimensions, COALESCE(p.descriptions, ''), p.active" +
            ")" +
            " FROM Plot p " +
            " WHERE p.field.id= :field_id")
    Page<PlotResquestDTO> findAllPlotResponseByFieldId(@Param("field_id") Long field_id,
                                                       Pageable pageable);

    @Query("SELECT NEW com.dgitalfactory.usersecurity.DTO.Plot.PlotResquestDTO(" +
            "p.id, p.name, p.dimensions, COALESCE(p.descriptions, ''), p.active" +
            ")" +
            " FROM Plot p WHERE p.id= :plot_id")
    PlotResquestDTO getPlotResponseByPlot_id(@Param("plot_id") Long plot_id);

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN TRUE ELSE FALSE END " +
            " FROM Plot p " +
            " WHERE p.id = :plot_Id " +
            " AND p.field.id = :field_Id")
    boolean existsByFieldIdAndPlotId(@Param("field_Id") Long field_Id,
                                     @Param("plot_Id") Long plot_Id);

    public @NotNull Optional<Plot> findById(@NotNull Long id);

    public Optional<Plot> findByName(String name);

    public boolean existsByName(String name);

}
