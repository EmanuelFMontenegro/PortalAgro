package com.dgitalfactory.usersecurity.utils;

import com.dgitalfactory.usersecurity.entity.Person;
import com.dgitalfactory.usersecurity.repository.PersonRepository;
import com.dgitalfactory.usersecurity.security.entity.Role;
import com.dgitalfactory.usersecurity.security.entity.User;
import com.dgitalfactory.usersecurity.security.repository.RoleRepository;
import com.dgitalfactory.usersecurity.security.repository.UserRepository;
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

    public Runner(UserRepository userrepo, RoleRepository authrepo) {
        this.userRepo = userrepo;
        this.roleRepo = authrepo;
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
                                .build(),
                        Person.builder()
                                .id(2L)
                                .build(),
                        Person.builder()
                                .id(3L)
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
    }
}