package com.dgitalfactory.usersecurity.repository;

import com.dgitalfactory.usersecurity.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Repository
public interface ContactRespository extends JpaRepository<Contact,Long> {
}
