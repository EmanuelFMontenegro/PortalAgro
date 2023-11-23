package com.dgitalfactory.usersecurity.security.service;

import com.dgitalfactory.usersecurity.security.dto.UserDTO;
import com.dgitalfactory.usersecurity.security.entity.Role;
import com.dgitalfactory.usersecurity.security.entity.User;
import com.dgitalfactory.usersecurity.exception.GlobalAppException;
import com.dgitalfactory.usersecurity.security.repository.RoleRepository;
import com.dgitalfactory.usersecurity.security.repository.UserRepository;
import com.dgitalfactory.usersecurity.utils.RoleName;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Verifies if the user exists
     *
     * @param username: type String
     * @return
     * <ul>
     *     <li>true: if it exist</li>
     *     <li>false: if it does not exist</li>
     * </ul>
     */
    public boolean existsUser(String username) {
        return this.userRepo.existsByUsername(username);
    }

    /**
     * Find user with username
     *
     * @param username: type String
     * @return
     * <ul>
     *     <li>User: If you find it</li>
     *     <li>@{@link GlobalAppException}</li>
     * </ul>
     */
    public User findUser(String username){
        User newUs = this.userRepo.findByUsername(username)
                .orElseThrow(()-> new GlobalAppException(HttpStatus.BAD_REQUEST, "Username does not exist.", "P-400"));
        return newUs;
    }

    /**
     * Resiter user by default your role is "visitor"
     *
     * @param userDTO: UserDTO (username, password)
     * @return user: tipe User
     */
    public User saveUser(UserDTO userDTO, String token) {
            Role roles = this.roleRepo.findByName(RoleName.ROLE_VISIT).get();
            User newUser = User.builder()
                    .username(userDTO.getUsername())
                    .password(this.passwordEncoder.encode(userDTO.getPassword()))
                    .roles(Collections.singleton(roles))
                    .tokenPassword(token)
                    .build();
            User us = this.userRepo.save(newUser);
            return this.findUser(us.getUsername());
    }

    /**
     * Save or update user
     *
     * @param user: type @{{@link User}}
     */
    public void saveUser(User user){
            this.userRepo.save(user);
    }

    /**
     * Finds the user based on the tokenpassword attribute that is used to recover password
     *
     * @param tokenPassword: type String
     * @return
     * <ul>
     *     <li>{@link User}: If you find it</li>
     *     <li>@{@link GlobalAppException}</li>
     * </ul>
     */
    public User getUserByTokenPassword(String tokenPassword){
        return this.userRepo.findByTokenPassword(tokenPassword)
                .orElseThrow(()-> new GlobalAppException(HttpStatus.BAD_REQUEST, "User does not exist with this credentials.", "P-400"));
    }

    /**
     * Edit password
     *
     * @param us: type @{{@link User}}
     * @param password: type String
     */
    public void setPassword(User us, String password){
        us.setPassword(this.passwordEncoder.encode(password));
        this.userRepo.save(us);
    }
}