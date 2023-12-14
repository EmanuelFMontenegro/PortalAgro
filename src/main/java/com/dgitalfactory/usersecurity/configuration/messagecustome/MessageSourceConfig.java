package com.dgitalfactory.usersecurity.configuration.messagecustome;

import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.context.support.ResourceBundleMessageSource;

import java.nio.charset.StandardCharsets;
import java.util.Locale;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 11/12/2023 - 10:41
 */
@Configuration
public class MessageSourceConfig {

    private static final String DEFAULT_BUNDLE_PATH = "classpath:messages/messages";
    private static final String DEFAULTS_PATH = "classpath:messages/defaults";

    @Bean
    public MessageSource messageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasenames(DEFAULT_BUNDLE_PATH, DEFAULTS_PATH);
        /**
         * esto hizo que toda la codificacion del codio cambie y aparezca
         * un signo de pregunta con triangulo en donde hay acentos
         */
//        messageSource.setDefaultEncoding("UTF-8");
        messageSource.setUseCodeAsDefaultMessage(true);
        messageSource.setAlwaysUseMessageFormat(true);
        return messageSource;
    }

//    @Bean
//    public ResourceBundleMessageSource messageSource() {
//        var resourceBundleMessageSource=new ResourceBundleMessageSource();
//        resourceBundleMessageSource.setBasenames("classpath:messages"); // directory with messages_XX.properties
//        resourceBundleMessageSource.setUseCodeAsDefaultMessage(true);
//        resourceBundleMessageSource.setDefaultLocale(new Locale("es", "AR"));
////        resourceBundleMessageSource.setDefaultLocale(Locale.of("en"));
//        resourceBundleMessageSource.setDefaultEncoding("UTF-8");
//        resourceBundleMessageSource.setAlwaysUseMessageFormat(true);
//        return resourceBundleMessageSource;
//    }
}
