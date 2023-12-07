package com.dgitalfactory.usersecurity.repository;

import com.dgitalfactory.usersecurity.entity.Field;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 04/12/2023 - 16:12
 */
public interface FieldRepository extends JpaRepository<Field,Long> {

    public Optional<Field> findById(Long id);

    public Optional<List<Field>> findByPersonId(Long personid);
}
