package com.dgitalfactory.usersecurity.repository;


import com.dgitalfactory.usersecurity.DTO.Person.PersonResponseDTO;
import com.dgitalfactory.usersecurity.entity.Person;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
            " COALESCE(l.id, 0), COALESCE(c.telephone,''))" +
            " FROM Person p JOIN p.address a JOIN p.contact c JOIN a.location l WHERE p.id= :user_id")
    Optional<PersonResponseDTO> findPersonDTOById(@Param("user_id") Long user_id);

    @Query("SELECT NEW com.dgitalfactory.usersecurity.DTO.Person.PersonResponseDTO(" +
            "p.id, COALESCE(p.name,''), COALESCE(p.lastname,''), COALESCE(p.dniCuit,''), COALESCE(p.descriptions,''), " +
            " COALESCE(l.id, 0), COALESCE(c.telephone,''))" +
            " FROM Person p JOIN p.address a JOIN p.contact c JOIN a.location l WHERE p.dniCuit= :dniCuit")
    public Optional<PersonResponseDTO> findPersonResponseDTOByDniCuit(@Param("dniCuit") String dniCuit);

    @Query("SELECT NEW com.dgitalfactory.usersecurity.DTO.Person.PersonResponseDTO(" +
            "p.id, COALESCE(p.name,''), COALESCE(p.lastname,''), COALESCE(p.dniCuit,''), COALESCE(p.descriptions,''), " +
            "COALESCE(l.id, 0), COALESCE(c.telephone,''))" +
            " FROM Person p JOIN p.address a JOIN p.contact c JOIN a.location l")
    Page<PersonResponseDTO> findAllPersonDTOOrderByLastname(Pageable pageable);

    public boolean existsByDniCuit(String dniCuit);
    public boolean existsById(Long userid);
    public Optional<Person> findById(Long id);
    public Optional<Person> findByDniCuit(String dniCuit);
    Page<Person> findAllByOrderByLastnameAscNameAsc(Pageable pageable);

}
