package com.dgitalfactory.usersecurity.utils;

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

@Component
public class Runner implements CommandLineRunner {

    @Autowired
    private final UserRepository userRepo;
    @Autowired
    private final RoleRepository roleRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public Runner(UserRepository userrepo, RoleRepository authrepo) {
        this.userRepo = userrepo;
        this.roleRepo = authrepo;
    }

    @Override
    public void run(String... args) throws Exception {
        if(this.roleRepo.count()==0){
            this.roleRepo.saveAll(
                    List.of(
                            new Role(RoleName.ROLE_OPERATOR),
                            new Role(RoleName.ROLE_ADMIN),
                            new Role(RoleName.ROLE_VISIT)
                    )
            );
        }
        if(this.userRepo.count()==0){
            Role visit = this.roleRepo.findByName(RoleName.ROLE_VISIT).get();
            Role operator = this.roleRepo.findByName(RoleName.ROLE_OPERATOR).get();
            Role admin = this.roleRepo.findByName(RoleName.ROLE_ADMIN).get();

            this.userRepo.saveAll(
                    List.of(
                            User.builder().username("orozcocristian860@gmail.com").password(this.passwordEncoder.encode("12345")).roles(Set.of(visit,operator, admin)).build(),
                            User.builder().username("user01@gmail.com").password(this.passwordEncoder.encode("12345")).roles(Collections.singleton(operator)).build(),
                            User.builder().username("user02@gmail.com").password(this.passwordEncoder.encode("12345")).roles(Collections.singleton(visit)).build()
                    )
            );
        }
    }
}
