package com.dgitalfactory.usersecurity.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class ConditionEvaluator {
    public boolean canPreAuthAdmin(String params){
        var auth = SecurityContextHolder.getContext().getAuthentication();
        return params.equals("admin") && auth.getName().equals("");
    }
}
