package com.dgitalfactory.usersecurity.repository;

import com.dgitalfactory.usersecurity.entity.AppServices.ServiceApp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 19/12/2023 - 09:11
 */
@Repository
public interface ServiceRepository extends JpaRepository<ServiceApp, Long> {
}
