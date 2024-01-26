package com.dgitalfactory.usersecurity.utils;

import com.dgitalfactory.usersecurity.repository.PersonRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.stream.Collectors;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Component
public class MigrationQueryRunner implements CommandLineRunner {

    private final static Logger log = LoggerFactory.getLogger(MigrationQueryRunner.class);
    @Autowired
    private PersonRepository personRepo;

    @PersistenceContext
    private EntityManager entityManager;

    public MigrationQueryRunner(PersonRepository personRepo) {
        this.personRepo = personRepo;
    }

    private boolean validateDataBase() {
//        return this.personRepo.findByDni("32035722").isPresent();
        return this.personRepo.count() == 0;
    }

    private void cargarDatosIniciales(String nameFiel) {
        String scriptContent = cargarContenidoScript(nameFiel);
        entityManager.createNativeQuery(scriptContent).executeUpdate();
        entityManager.clear();
        log.info("------->Datos iniciales cargados con éxito.");
    }

    private String cargarContenidoScript(String scriptPath) {
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream(scriptPath)) {
            if (inputStream == null) {
                throw new RuntimeException("----------->No se pudo encontrar el archivo: " + scriptPath);
            }

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
                return reader.lines().collect(Collectors.joining("\n"));
            }
        } catch (IOException e) {
            throw new RuntimeException("---------------->Error al leer el script de carga de datos", e);
        }
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (this.validateDataBase()) {
//            this.cargarContenidoScript("initialization/V1.4__xxxx.sql");
            this.cargarDatosIniciales("db/V1.4__init_20240126.sql");
        }
    }
}