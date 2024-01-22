package com.dgitalfactory.usersecurity.repository.Fields;

import com.dgitalfactory.usersecurity.DTO.TypePlantation.TypePlantationRequestDTO;
import com.dgitalfactory.usersecurity.entity.Fields.TypePlantation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 17/01/2024 - 11:43
 */
public interface TypePlantationRespository extends JpaRepository<TypePlantation, Long> {
    @Query("SELECT NEW com.dgitalfactory.usersecurity.DTO.TypePlantation.TypePlantationRequestDTO(" +
            "t.id, t.name, COALESCE(t.description,''), t.active)" +
            " FROM TypePlantation t WHERE t.active= :active")
    List<TypePlantationRequestDTO> findByIsActive(@Param("active") boolean active);

    public Optional<TypePlantation> findByName(String name);

    public boolean existsByName(String name);

    public boolean existsById(Long id);

}
