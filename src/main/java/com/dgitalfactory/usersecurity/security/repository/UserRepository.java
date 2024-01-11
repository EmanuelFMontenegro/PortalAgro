package com.dgitalfactory.usersecurity.security.repository;

import com.dgitalfactory.usersecurity.entity.Person;
import com.dgitalfactory.usersecurity.security.entity.User;
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
 * @created 30/11/2023 - 08:54
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    public Optional<User> findByUsername(String username);

    Page<User> findAll(Pageable pageable);

    public Optional<User> findById(Long userid);

    public List<User> findAll();

    public boolean existsByUsername(String username);

    public Optional<User> findByTokenPassword(String tokenPassword);

    @Query("SELECT u FROM User u " +
                " WHERE LOWER(u.username) " +
                " LIKE LOWER(CONCAT('%', :keyword, '%')" +
            ")")
    Page<User> findByNameOrLastNameLike(@Param("keyword") String keyword, Pageable pageable);

    @Modifying
    @Query("Update User u Set u.failedAttempts = :failedAttempt  Where u.username =:username")
    void updateFailedAttempts(@Param("failedAttempt") int failedAttempt, @Param("username") String username);

    @Modifying
    @Query("Update User u Set u.account_active = :account_active  Where u.id =:userid")
    void editStatusUser(@Param("account_active") boolean account_active,@Param("userid") Long userid);

}
