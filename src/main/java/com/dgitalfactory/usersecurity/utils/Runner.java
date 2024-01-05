package com.dgitalfactory.usersecurity.utils;

import com.dgitalfactory.usersecurity.entity.Address;
import com.dgitalfactory.usersecurity.entity.AppServices.TypeService;
import com.dgitalfactory.usersecurity.entity.Contact;
import com.dgitalfactory.usersecurity.entity.Person;
import com.dgitalfactory.usersecurity.repository.PersonRepository;
import com.dgitalfactory.usersecurity.repository.TypeServiceRepository;
import com.dgitalfactory.usersecurity.security.entity.Role;
import com.dgitalfactory.usersecurity.security.entity.User;
import com.dgitalfactory.usersecurity.security.repository.RoleRepository;
import com.dgitalfactory.usersecurity.security.repository.UserRepository;
import com.dgitalfactory.usersecurity.utils.enums.RoleName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Set;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Component
public class Runner implements CommandLineRunner {

    @Autowired
    private final UserRepository userRepo;
    @Autowired
    private final RoleRepository roleRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private PersonRepository personRepo;

    @Autowired
    private TypeServiceRepository typeServiceRepo;

    public Runner(UserRepository userrepo, RoleRepository authrepo, TypeServiceRepository typeServiceRepo) {
        this.userRepo = userrepo;
        this.roleRepo = authrepo;
        this.typeServiceRepo= typeServiceRepo;
    }

    public void createdRoles() {
        if (this.roleRepo.count() == 0) {
            this.roleRepo.saveAll(
                    List.of(
                            new Role(RoleName.ROLE_OPERATOR),
                            new Role(RoleName.ROLE_ADMIN),
                            new Role(RoleName.ROLE_VISIT)
                    )
            );
        }
    }

    private void createdUser() {

        Role visit = this.roleRepo.findByName(RoleName.ROLE_VISIT).get();
        Role operator = this.roleRepo.findByName(RoleName.ROLE_OPERATOR).get();
        Role admin = this.roleRepo.findByName(RoleName.ROLE_ADMIN).get();

        this.userRepo.saveAll(
                List.of(
                        User.builder().username("orozcocristian860@gmail.com")
                                .password(this.passwordEncoder.encode("12345678"))
                                .account_active(true)
                                .accountNonLocked(true)
                                .failedAttempts(0)
                                .lockeTime(null)
                                .roles(Set.of(visit, operator, admin)).build(),
                        User.builder().username("user01@gmail.com")
                                .password(this.passwordEncoder.encode("12345678"))
                                .account_active(true)
                                .accountNonLocked(true)
                                .failedAttempts(0)
                                .lockeTime(null)
                                .roles(Collections.singleton(operator)).build(),
                        User.builder().username("user02@gmail.com")
                                .password(this.passwordEncoder.encode("12345678"))
                                .account_active(true)
                                .accountNonLocked(true)
                                .failedAttempts(0)
                                .lockeTime(null)
                                .roles(Collections.singleton(visit)).build()
                )
        );
    }

    private void createdPerson() {

        this.personRepo.saveAll(
                List.of(
                        Person.builder()
                                .id(1L)
                                .name("Cristian")
                                .lastname("Orozco")
                                .dniCuit("32035722")
                                .address(Address.builder()
                                        .location("Posadas")
                                        .build())
                                .contact(Contact.builder()
                                        .telephone("3764373992")
                                        .build())
                                .build(),
                        Person.builder()
                                .id(2L)
                                .name("user02")
                                .lastname("user02")
                                .dniCuit("2222222")
                                .address(Address.builder()
                                        .location("2 de Mayo")
                                        .build())
                                .contact(Contact.builder()
                                        .telephone("3764222222")
                                        .build())
                                .build(),
                        Person.builder()
                                .id(3L)
                                .name("user03")
                                .lastname("user03")
                                .dniCuit("3333333")
                                .address(Address.builder()
                                        .location("Eldorado")
                                        .build())
                                .contact(Contact.builder()
                                        .telephone("3764333333")
                                        .build())
                                .build()
                )
        );
    }

    private void createdTypeService(){
        this.typeServiceRepo.saveAll(
                List.of(
                        TypeService.builder()
                                .name("Aplicación de Productos")
                                .description("Uso de dron para realizar la aplicación de un producto determinado, según area y tipo de plantación")
                                .build(),
                        TypeService.builder()
                                .name("Imagenes")
                                .description("Servicio de control de estado de plantación por imágenes")
                                .build()
                )
        );
    }

    @Override
    public void run(String... args) throws Exception {
        if (this.roleRepo.count() == 0) {
            this.createdRoles();
        }
        if (this.userRepo.count() == 0) {
            this.createdUser();
        }
        if(this.personRepo.count()==0){
            this.createdPerson();
        }
        if(this.typeServiceRepo.count()==0){
            this.createdTypeService();
        }
    }
}