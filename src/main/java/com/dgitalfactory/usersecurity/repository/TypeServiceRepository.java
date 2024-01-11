package com.dgitalfactory.usersecurity.repository;

import com.dgitalfactory.usersecurity.DTO.AppService.TypeServiceDTO;
import com.dgitalfactory.usersecurity.entity.AppServices.TypeService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 19/12/2023 - 10:42
 */
@Repository
public interface TypeServiceRepository extends JpaRepository<TypeService, Long> {

    @Query("SELECT NEW com.dgitalfactory.usersecurity.DTO.AppService.TypeServiceDTO(" +
            "t.id, t.name, COALESCE(t.description,'')) " +
            " FROM TypeService t WHERE t.isActive= :active")
    List<TypeServiceDTO> findByIsActive(@Param("active") boolean active);

    public Optional<TypeService> findByName(String name);

    public boolean existsByName(String name);

    public boolean existsById(Long id);


}
