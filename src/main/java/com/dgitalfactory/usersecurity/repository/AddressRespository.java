package com.dgitalfactory.usersecurity.repository;

import com.dgitalfactory.usersecurity.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRespository extends JpaRepository<Address,Long> {
}
