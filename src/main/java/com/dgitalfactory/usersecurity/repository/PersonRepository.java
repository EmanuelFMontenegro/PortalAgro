package com.dgitalfactory.usersecurity.repository;

import com.dgitalfactory.usersecurity.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {

    public boolean existsByDni(String dni);
    public boolean existsByUserid(Long userid);
    public Optional<Person> findById(Long id);
    public Optional<Person> findByDni(String dni);
    public Optional<Person> findByUserid(Long userid);

}
