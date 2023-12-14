package com.dgitalfactory.usersecurity.repository;

import com.dgitalfactory.usersecurity.entity.Services.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 14/12/2023 - 13:07
 */
@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
}
