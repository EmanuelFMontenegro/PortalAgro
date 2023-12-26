package com.dgitalfactory.usersecurity.service;

import com.dgitalfactory.usersecurity.exception.ResourceNotFoundException;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.view.RedirectView;
/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Service
public class UtilService {

    @Autowired
    private UtilsCommons utilsCommons;

    public RedirectView redirectURL(String urlDestination){
        return new RedirectView(urlDestination);
    }
}
