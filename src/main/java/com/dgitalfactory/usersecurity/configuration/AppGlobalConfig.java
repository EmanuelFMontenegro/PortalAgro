package com.dgitalfactory.usersecurity.configuration;

import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppGlobalConfig {

    @Bean
    public UtilsCommons utilsCommons(){
        return new UtilsCommons();
    };
}
