package com.dgitalfactory.usersecurity.security.service;

import com.dgitalfactory.usersecurity.exception.ResourceNotFoundException;
import com.dgitalfactory.usersecurity.security.dto.UserResponseDTO;
import com.dgitalfactory.usersecurity.security.dto.UserDTO;
import com.dgitalfactory.usersecurity.security.entity.Role;
import com.dgitalfactory.usersecurity.security.entity.User;
import com.dgitalfactory.usersecurity.exception.GlobalAppException;
import com.dgitalfactory.usersecurity.security.repository.RoleRepository;
import com.dgitalfactory.usersecurity.security.repository.UserRepository;
import com.dgitalfactory.usersecurity.service.PersonService;
import com.dgitalfactory.usersecurity.utils.RoleName;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Service
public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private PersonService personrSVC;

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
                .orElseThrow(()->
                    new GlobalAppException(HttpStatus.BAD_REQUEST, 4019,"")
                );
        return newUs;
    }

    /**
     * Find user by Id
     * @param userid: type @{@link Long}
     * @return @{@link UserDTO}
     */
    public UserDTO findUserDTO(Long userid){
        User newUs = this.findUser(userid);
        return UtilsCommons.convertDTOToEntity(newUs,UserDTO.class);
    }

    /**
     * Find all users
     * @return @{@link UserDTO}
     */
    public List<UserDTO> findAllUserDTO(){
        List<UserDTO> listUsers = this.userRepo.findAll().stream().map(
            user -> UtilsCommons.convertEntityToDTO(user,UserDTO.class)
        ).toList();
        return listUsers;
    }

    /**
     * Find user by id
     * @param userid
     * @return @{@link User}
     */
    public User findUser(Long userid){
        User newUs = this.userRepo.findById(userid)
                .orElseThrow(()-> new ResourceNotFoundException("User", "id",userid));

        return newUs;
    }

    /**
     * Delete user and their relationships
     * @param userid: type Long
     */
    @Transactional
    public void deleteUserById(Long userid){
        Optional<User> userOpt = this.userRepo.findById(userid);
        this.userRepo.delete(userOpt.get());
        this.personrSVC.deletePersonById(userid);
    }

    /**
     * Resiter user by default your role is "visitor"
     *
     * @param userDTO: UserDTO (username, password)
     * @return user: tipe User
     */
//    @Transactional(propagation = Propagation.SUPPORTS)
    public User saveUser(UserResponseDTO userDTO, String token) {
            Role roles = this.roleRepo.findByName(RoleName.ROLE_VISIT).get();
            User newUser = User.builder()
                    .username(userDTO.getUsername().toLowerCase())
                    .password(this.passwordEncoder.encode(userDTO.getPassword()))
                    .roles(Collections.singleton(roles))
                    .account_active(false)
                    .tokenPassword(token)
                    .accountNonLocked(true)
                    .failedAttempts(0)
                    .lockeTime(null)
                    .build();
            this.userRepo.save(newUser);
            return this.findUser(userDTO.getUsername());
    }

    /**
     * Save or update user
     *
     * @param user: type @{{@link User}}
     */
//    @Transactional(propagation = Propagation.SUPPORTS, rollbackFor = {Exception.class})
    public void saveUser(User user){
        try {
            this.userRepo.save(user);
        }catch (Exception ex){
            log.error(ex.getMessage());
        }
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
        User us= this.userRepo.findByTokenPassword(tokenPassword)
                .orElseThrow(()-> new GlobalAppException(HttpStatus.BAD_REQUEST, 4020,""));
        return us;
    }

    /**
     * Reset Failed Attemps by id user
     * @param username: type {@link String}
     */
    @Transactional
    public void resetFailedAttempts(String username){
        this.userRepo.updateFailedAttempts(0,username);
    }



    /**
     * Edit password
     *
     * @param us: type @{{@link User}}
     * @param password: type {@link String}
     */
//    @Transactional(propagation = Propagation.SUPPORTS)
    public void setPassword(User us, String password){
        us.setPassword(this.passwordEncoder.encode(password));
        this.userRepo.save(us);
    }
}