package com.dgitalfactory.usersecurity.service;

import com.dgitalfactory.usersecurity.repository.ImagesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 14/12/2023 - 13:13
 */
@Service
public class ImagesService {

    @Autowired
    private ImagesRepository imgRepo;
}
