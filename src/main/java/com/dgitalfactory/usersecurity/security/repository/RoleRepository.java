package com.dgitalfactory.usersecurity.security.repository;

import com.dgitalfactory.usersecurity.security.entity.Role;
import com.dgitalfactory.usersecurity.utils.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role,Long> {

    Optional<Role> findByName(RoleName name);

}
