package com.dgitalfactory.usersecurity.repository;

import com.dgitalfactory.usersecurity.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRespository extends JpaRepository<Contact,Long> {
}
