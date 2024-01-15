package com.dgitalfactory.usersecurity.repository;


import com.dgitalfactory.usersecurity.DTO.Person.PersonResponseDTO;
import com.dgitalfactory.usersecurity.DTO.Person.PersonUserProfile;
import com.dgitalfactory.usersecurity.entity.Person;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {

    @Query("SELECT NEW com.dgitalfactory.usersecurity.DTO.Person.PersonResponseDTO(" +
            "p.id, COALESCE(p.name,''), COALESCE(p.lastname,''), COALESCE(p.dniCuit,''), COALESCE(p.descriptions,''), " +
            " COALESCE(p.address.location.id, 0L), COALESCE(p.contact.telephone,''))" +
            " FROM Person p WHERE p.id= :user_id")
    Optional<PersonResponseDTO> findPersonDTOById(@Param("user_id") Long user_id);

    @Query("SELECT NEW com.dgitalfactory.usersecurity.DTO.Person.PersonResponseDTO(" +
            "p.id, COALESCE(p.name,''), COALESCE(p.lastname,''), COALESCE(p.dniCuit,''), COALESCE(p.descriptions,''), " +
            " COALESCE(p.address.location.id, 0L), COALESCE(p.contact.telephone,''))" +
            " FROM Person p WHERE p.dniCuit= :dniCuit")
    public Optional<PersonResponseDTO> findPersonResponseDTOByDniCuit(@Param("dniCuit") String dniCuit);

    @Query("SELECT NEW com.dgitalfactory.usersecurity.DTO.Person.PersonUserProfile(" +
                "u.id as id, " +
                "COALESCE(u.username, ''), " +
                "COALESCE(p.name, ''), " +
                "COALESCE(p.lastname, ''), " +
                " 'url://' " +
            ")" +
            " FROM User u " +
            " LEFT JOIN Person p ON u.id = p.id " +
            " WHERE p.id= :user_id")
    Optional<PersonUserProfile> findPersonUserProfile(@Param("user_id") Long user_id);

    @Query(value = "SELECT u.id as id, " +
            "u.username as username, " +
            "u.account_active as account_active, " +
            "u.accountNonLocked as accountNonLocked, " +
            "u.failedAttempts as failedAttempts, " +
            "u.lockeTime as lockeTime, " +
            "(SELECT ARRAY_AGG(r.id || ',' || r.name) FROM users_roles ur " +
            "JOIN roles r ON ur.role_id = r.id " +
            "WHERE ur.user_id = u.id) as roles, " +
            "p.name as name, " +
            "p.lastname as lastName," +
            "p.dniCuit as dniCuit," +
            "p.descriptions as descriptions," +
            "l.id as location_id," +
            "c.telephone as telephone " +
            " FROM users u " +
            " LEFT JOIN people p ON u.id = p.id " +
            " LEFT JOIN contacts c ON p.contact_id = c.id " +
            " LEFT JOIN addresses a ON p.address_id = a.id " +
            " LEFT JOIN locations l ON a.location_id = l.id ",
            nativeQuery = true)
    Page<Object[]> findAllPersonUserPageable(Pageable pageable);

    @Query(value = "SELECT u.id as id, " +
            "u.username as username, " +
            "u.account_active as account_active, " +
            "u.accountNonLocked as accountNonLocked, " +
            "u.failedAttempts as failedAttempts, " +
            "u.lockeTime as lockeTime, " +
            "(SELECT ARRAY_AGG(r.id || ',' || r.name) FROM users_roles ur " +
            "JOIN roles r ON ur.role_id = r.id " +
            "WHERE ur.user_id = u.id) as roles, " +
            "p.name as name, " +
            "p.lastname as lastName," +
            "p.dniCuit as dniCuit," +
            "p.descriptions as descriptions," +
            "l.id as location_id," +
            "c.telephone as telephone " +
            " FROM users u " +
            " LEFT JOIN people p ON u.id = p.id " +
            " LEFT JOIN contacts c ON p.contact_id = c.id " +
            " LEFT JOIN addresses a ON p.address_id = a.id " +
            " LEFT JOIN locations l ON a.location_id = l.id " +
            " WHERE LOWER(p.name) " +
            " LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            " OR LOWER(p.lastname) " +
            " LIKE LOWER(CONCAT('%', :keyword, '%'))",
            nativeQuery = true)
    Page<Object[]> findAllPersonUserByNamesPageable(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT NEW com.dgitalfactory.usersecurity.DTO.Person.PersonResponseDTO(" +
                "p.id, COALESCE(p.name,''), " +
                " COALESCE(p.lastname,''), " +
                " COALESCE(p.dniCuit,''), " +
                " COALESCE(p.descriptions,''), " +
                " COALESCE(p.address.location.id, 0L), " +
                " COALESCE(p.contact.telephone, '') " +
            ")" +
            " FROM Person p")
    Page<PersonResponseDTO> findAllPersonDTOPageable(Pageable pageable);

    @Query("SELECT NEW com.dgitalfactory.usersecurity.DTO.Person." +
            "PersonResponseDTO(" +
                "p.id, COALESCE(p.name,''), " +
                " COALESCE(p.lastname,''), " +
                " COALESCE(p.dniCuit,''), " +
                " COALESCE(p.descriptions,''), " +
                " COALESCE(p.address.location.id, 0L), " +
                " COALESCE(p.contact.telephone, '') " +
            ")" +
            " FROM Person p " +
            " WHERE LOWER(p.name) " +
            " LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            " OR LOWER(p.lastname) " +
            " LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<PersonResponseDTO> findByNameOrLastNameLike(@Param("keyword") String keyword, Pageable pageable);

    public boolean existsByDniCuit(String dniCuit);
    public boolean existsById(Long userid);
    public Optional<Person> findById(Long id);
    public Optional<Person> findByDniCuit(String dniCuit);
    Page<Person> findAllByOrderByLastnameAscNameAsc(Pageable pageable);

}
