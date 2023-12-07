package com.dgitalfactory.usersecurity.configuration.database;

import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Properties;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 03/12/2023 - 22:52
 */
@Configuration
@EnableJpaRepositories(
        entityManagerFactoryRef = "postgresEMF",
        transactionManagerRef = "postgresTrxManager",
        basePackages = {
                "com.dgitalfactory.usersecurity.repository",
                "com.dgitalfactory.usersecurity.security.repository"}
)
@EnableTransactionManagement
public class PostgresJpaConfig {

/*    @Value("${postgres.db.jpa.database-platform}")
    private String DIALECT;*/

    @Value("${postgres.db.jpa.show-sql}")
    private String SHOW_SQL;

    @Value("${postgres.db.jpa.hibernate.ddl-auto}")
    private String AUTO_DDL;

    @Value("${postgres.db.jpa.properties.hibernate.format_sql}")
    private String FORMAT_SQL;

    @Primary
    @Bean(name = "postgresEMF")
    public LocalContainerEntityManagerFactoryBean entityManagerFactoryBean(
            @Qualifier("postgresDataSource") DataSource posgresDS, EntityManagerFactoryBuilder builder) {

        Map<String, Object> additionalProps = new HashMap<>();
//        additionalProps.put("hibernate.dialect", DIALECT);
        additionalProps.put("hibernate.ddl-auto", AUTO_DDL);
        additionalProps.put("hibernate.hbm2ddl.auto", AUTO_DDL);
        additionalProps.put("hibernate.show_sql", SHOW_SQL);
        additionalProps.put("hibernate.format_sql", FORMAT_SQL);

        return builder
                .dataSource(posgresDS)
                .persistenceUnit("postgres")
                .properties(additionalProps)
                .packages(
                        "com.dgitalfactory.usersecurity.entity",
                        "com.dgitalfactory.usersecurity.security.entity")
                .build();
    }

    @Primary
    @Bean("postgresTrxManager")
    public JpaTransactionManager getPostgresTrxManager(
            @Qualifier("postgresEMF") LocalContainerEntityManagerFactoryBean postgresEMF) {
        return new JpaTransactionManager(Objects.requireNonNull(postgresEMF.getObject()));
    }
}
