package com.dgitalfactory.usersecurity.repository;

import com.dgitalfactory.usersecurity.DTO.Location.LocationRequestDTO;
import com.dgitalfactory.usersecurity.entity.Location.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 08/01/2024 - 13:11
 */
@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {

    boolean existsByName(String name);

    @Query("SELECT NEW com.dgitalfactory.usersecurity.DTO.Location.LocationRequestDTO(" +
            " l.id, l.name) " +
            " FROM Location l WHERE l.name= :name")
    Optional<LocationRequestDTO> findLocalDTOByName(@Param("name") String name);

    @Query("SELECT NEW com.dgitalfactory.usersecurity.DTO.Location.LocationRequestDTO(" +
            " l.id, l.name) " +
            " FROM Location l WHERE l.id= :id")
    Optional<LocationRequestDTO> findLocalDTOById(@Param("id") Long id);

    @Query("SELECT NEW com.dgitalfactory.usersecurity.DTO.Location.LocationRequestDTO(" +
            " l.id, l.name) " +
            " FROM Location l " +
            " WHERE l.name LIKE %:name% " +
            " ORDER BY CASE WHEN :order = 'asc' THEN l.name END ASC, CASE WHEN :order = 'desc' THEN l.name END DESC")
    List<LocationRequestDTO> findLocationsLikeName(@Param("name") String name, @Param("order") String order);

    @Query("SELECT NEW com.dgitalfactory.usersecurity.DTO.Location.LocationRequestDTO(" +
            " l.id, l.name) " +
            " FROM Location l " +
            "ORDER BY " +
            "CASE WHEN :order = 'asc' THEN l.name END ASC, " +
            "CASE WHEN :order = 'desc' THEN l.name END DESC")
    List<LocationRequestDTO> findAllLocationDTO(@Param("order") String order);
    Optional<Location> findLocationById(Long id);

}
