package com.dgitalfactory.usersecurity.security.repository;

import com.dgitalfactory.usersecurity.security.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    public Optional<User> findByUsername(String username);

    public boolean existsByUsername(String username);
    public Optional<User> findByTokenPassword(String tokenPassword);
}
