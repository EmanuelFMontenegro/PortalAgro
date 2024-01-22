package com.dgitalfactory.usersecurity.repository.Fields;

import com.dgitalfactory.usersecurity.DTO.Field.FieldDTO;
import com.dgitalfactory.usersecurity.entity.Fields.Field;
import com.dgitalfactory.usersecurity.entity.Person;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 04/12/2023 - 16:12
 */
@Repository
public interface FieldRepository extends JpaRepository<Field,Long> {

    @Query("SELECT NEW com.dgitalfactory.usersecurity.DTO.Field.FieldDTO(" +
            "f.id, f.name, f.dimensions, f.observation, f.geolocation,f.address, f.contact, f.person.id, f.active) " +
            " FROM Field f " +
            " WHERE f.person.id = :userid AND" +
            " f.active= :active")
    Page<FieldDTO> findAllFieldsDTOByUserId(@Param("userid") Long userid,@Param("active") boolean active, Pageable pageable);

    @Query("SELECT NEW com.dgitalfactory.usersecurity.DTO.Field.FieldDTO(" +
            "f.id, f.name, f.dimensions, f.observation, f.geolocation,f.address, f.contact, f.person.id, f.active) " +
            " FROM Field f ")
    Page<FieldDTO> findAllFieldsDTO(Pageable pageable);

    @Query("SELECT NEW com.dgitalfactory.usersecurity.DTO.Field.FieldDTO(" +
            "f.id, f.name, f.dimensions, f.observation, f.geolocation,f.address, f.contact, f.person.id, f.active) " +
            " FROM Field f " +
            " WHERE f.active = :active")
    Page<FieldDTO> findAllFieldsByActiveDTO(Pageable pageable, @Param("active") boolean active);

    @Query("SELECT NEW com.dgitalfactory.usersecurity.DTO.Field.FieldDTO(" +
            "f.id, f.name, f.dimensions, f.observation, f.geolocation,f.address, f.contact, f.person.id, f.active) " +
            "FROM Field f WHERE f.id = :id")
    Optional<FieldDTO> findFieldDTOById(@Param("id") Long id);
    public Optional<Field> findById(Long id);

    public Optional<Field> findByName(String name);

    public boolean existsByName(String name);

    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN TRUE ELSE FALSE END " +
            "FROM Field f WHERE f.name = :fieldName AND f.person.id = :userId")
    boolean existsByFieldNameAndUserId(@Param("fieldName") String fieldName, @Param("userId") Long userId);

    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN TRUE ELSE FALSE END " +
            "FROM Field f WHERE f.id = :fieldId AND f.person.id = :userId")
    boolean existsByFieldIdAndUserId(@Param("fieldId") Long fieldId, @Param("userId") Long userId);

    public Optional<List<Field>> findByPersonId(Long personid);

    Page<Field> findAllByOrderByNameAsc(Pageable pageable);

    Page<Field> findAllByPersonOrderByNameAsc(Person person, Pageable pageable);

    @Query("SELECT f.geolocation FROM Field f WHERE f.id = :fieldId")
    String getGeolocationByFieldId(@Param("fieldId") Long fieldId);

    @Modifying
    @Query("UPDATE Field f SET f.geolocation = :geo WHERE f.id = :fieldId")
    void updateGeolocationByFieldId(@Param("fieldId") Long fieldId, @Param("geo") String geo);
}
