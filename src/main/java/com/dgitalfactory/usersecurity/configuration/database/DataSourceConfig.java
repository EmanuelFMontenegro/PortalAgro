package com.dgitalfactory.usersecurity.configuration.database;

import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 03/12/2023 - 22:45
 */
@Configuration
public class DataSourceConfig {

    @Primary
    @Bean("postgresProperties")
    @ConfigurationProperties(prefix = "postgres.db.datasource")
    public DataSourceProperties getPostgresProperties(){
        return new DataSourceProperties();
    }

    @Primary
    @Bean("postgresDataSource")
    public DataSource getPostgresDataSource(){
        return this.getPostgresProperties().initializeDataSourceBuilder()
                .build();
    }

//    @Bean("mysqlProperties")
//    @ConfigurationProperties(prefix = "mysql.db.datasource")
//    public DataSourceProperties getMysqlProperties(){
//        return new DataSourceProperties();
//    }
//
//    @Bean("mysqlDataSource")
//    public DataSource getMysqlDataSource(){
//        return this.getMysqlProperties().initializeDataSourceBuilder()
//                .build();
//    }


}
