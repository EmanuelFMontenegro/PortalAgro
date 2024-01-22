package com.dgitalfactory.usersecurity.service.RequestServiceRelated;

import com.dgitalfactory.usersecurity.repository.RequestServices.ImagesSvrRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 14/12/2023 - 13:13
 */
@Service
public class ImagesSvrService {

    @Autowired
    private ImagesSvrRepository imgRepo;
}
