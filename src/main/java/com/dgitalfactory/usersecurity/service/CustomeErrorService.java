package com.dgitalfactory.usersecurity.service;

import com.dgitalfactory.usersecurity.exception.ResourceNotFoundException;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 13/12/2023 - 11:31
 */
@Service
public class CustomeErrorService {
    @Autowired
    private UtilsCommons utilsCommons;

    public ResourceNotFoundException getResourceNotFoundException(String nameResource, String fieldName, Object fieldValue){
        return new ResourceNotFoundException(utilsCommons.getMessage("string.format.id.not.fount"),
                nameResource,fieldName,fieldValue);
    }
}
