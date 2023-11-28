package com.dgitalfactory.usersecurity.security.repository;

import com.dgitalfactory.usersecurity.security.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    public Optional<User> findByUsername(String username);
    public Optional<User> findById(Long userid);

    public List<User> findAll();

    public boolean existsByUsername(String username);
    public Optional<User> findByTokenPassword(String tokenPassword);

    @Modifying
    @Query("Update users u Set u.failed_attemps = :failed_attemps  Where u.username =:username")
    void updateFailedAttemps(int failed_attemps, String username);

}
