package com.dgitalfactory.usersecurity.service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.view.RedirectView;

@Service
public class UtilService {

    public RedirectView redirectURL(String urlDestination){
        RedirectView redir = new RedirectView(urlDestination);
        return redir;
    }
}
