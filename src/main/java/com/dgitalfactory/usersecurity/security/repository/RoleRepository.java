package com.dgitalfactory.usersecurity.security.repository;

import com.dgitalfactory.usersecurity.DTO.Person.PersonUserResponseDTO;
import com.dgitalfactory.usersecurity.security.dto.RoleResponseDTO;
import com.dgitalfactory.usersecurity.security.entity.Role;
import com.dgitalfactory.usersecurity.utils.enums.RoleName;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Repository
public interface RoleRepository extends JpaRepository<Role,Long> {

    Optional<Role> findByName(RoleName name);

    @Query("SELECT NEW com.dgitalfactory.usersecurity.security.dto.RoleResponseDTO( " +
                    " r.id, " +
                    " r.name" +
                " ) "+
            " FROM User u JOIN u.roles r")
    List<RoleResponseDTO> findAllRolesByUser();

}
