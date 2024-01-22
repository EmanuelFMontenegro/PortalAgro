package com.dgitalfactory.usersecurity.repository.RequestServices;

import com.dgitalfactory.usersecurity.entity.AppServices.ImagesService;
import jdk.jfr.Registered;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 14/12/2023 - 13:09
 */
@Registered
public interface ImagesSvrRepository extends JpaRepository<ImagesService, Long> {
}
