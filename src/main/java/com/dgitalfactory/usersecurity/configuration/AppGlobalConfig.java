package com.dgitalfactory.usersecurity.configuration;

import com.dgitalfactory.usersecurity.utils.ResponseConstants;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Configuration
public class AppGlobalConfig {

//    @Bean
//    public UtilsCommons utilsCommons(){
//        return new UtilsCommons();
//    };

    @Bean
    public ResponseConstants responseConstants(){
        return new ResponseConstants();
    }

    @Bean
    public ModelMapper modoelMapper() {
        return new ModelMapper();
    }

}
