package com.dgitalfactory.usersecurity.repository;

import com.dgitalfactory.usersecurity.entity.Services.Images;
import jdk.jfr.Registered;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 14/12/2023 - 13:09
 */
@Registered
public interface ImagesRepository extends JpaRepository<Images, Long> {
}
