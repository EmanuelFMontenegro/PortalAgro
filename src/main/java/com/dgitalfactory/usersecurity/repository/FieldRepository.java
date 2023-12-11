package com.dgitalfactory.usersecurity.repository;

import com.dgitalfactory.usersecurity.entity.Field;
import com.dgitalfactory.usersecurity.entity.Person;
import com.dgitalfactory.usersecurity.security.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 04/12/2023 - 16:12
 */
public interface FieldRepository extends JpaRepository<Field,Long> {

    public Optional<Field> findById(Long id);

    public Optional<Field> findByName(String name);

    public Optional<List<Field>> findByPersonId(Long personid);

    Page<Field> findAllByOrderByNameAsc(Pageable pageable);

    Page<Field> findAllByPersonOrderByNameAsc(Person person, Pageable pageable);

    @Query("SELECT f.geolocation FROM Field f WHERE f.id = :fieldId")
    String getGeolocationByFieldId(@Param("fieldId") Long fieldId);

    @Modifying
    @Query("UPDATE Field f SET f.geolocation = :geo WHERE f.id = :fieldId")
    void updateGeolocationByFieldId(@Param("fieldId") Long fieldId, @Param("geo") String geo);
}
