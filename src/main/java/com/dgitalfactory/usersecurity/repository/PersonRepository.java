package com.dgitalfactory.usersecurity.repository;


import com.dgitalfactory.usersecurity.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {

    public boolean existsByDni(String dni);
    public boolean existsById(Long userid);
    public Optional<Person> findById(Long id);
    public Optional<Person> findByDni(String dni);

}
