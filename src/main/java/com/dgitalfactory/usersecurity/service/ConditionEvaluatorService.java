package com.dgitalfactory.usersecurity.service;

import com.dgitalfactory.usersecurity.security.entity.CustomeUserDetails;
import com.dgitalfactory.usersecurity.security.service.SecurityUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Service
public class ConditionEvaluatorService {

    @Autowired
    private SecurityUserDetailsService userDetailsSVC;

    public boolean canPreAuthAdmin(Long params){
        var auth = SecurityContextHolder.getContext().getAuthentication();
        CustomeUserDetails customeUserDetails = (CustomeUserDetails) this.userDetailsSVC.loadUserByUsername(auth.getName());
        return customeUserDetails.getUser().getId().equals(params);
    }
}
