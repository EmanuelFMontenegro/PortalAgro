package com.dgitalfactory.usersecurity.repository;

import com.dgitalfactory.usersecurity.entity.AppServices.ProductApSvr;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 14/12/2023 - 13:09
 */
@Repository
public interface ProductApSvrRepository extends JpaRepository<ProductApSvr,Long> {
}
