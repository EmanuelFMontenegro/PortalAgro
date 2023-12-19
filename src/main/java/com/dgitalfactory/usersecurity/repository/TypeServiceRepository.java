package com.dgitalfactory.usersecurity.repository;

import com.dgitalfactory.usersecurity.entity.AppServices.TypeService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 19/12/2023 - 10:42
 */
@Repository
public interface TypeServiceRepository extends JpaRepository<TypeService, Long> {

    public Optional<TypeService> findByName(String name);

    public boolean existsByName(String name);

    public boolean existsById(Long id);


}
