package com.dgitalfactory.usersecurity.security.service;

import com.dgitalfactory.usersecurity.exception.GlobalAppException;
import com.dgitalfactory.usersecurity.security.entity.CustomeUserDetails;
import com.dgitalfactory.usersecurity.security.entity.User;
import com.dgitalfactory.usersecurity.exception.ResourceNotFoundException;
import com.dgitalfactory.usersecurity.security.repository.UserRepository;
import com.dgitalfactory.usersecurity.utils.AppConstants;
import com.dgitalfactory.usersecurity.utils.NumberUtils;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Collection;
import java.util.Optional;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
@Service
public class SecurityUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User optUser = this.userRepo.findByUsername(username)
                .orElseThrow(()-> new ResourceNotFoundException("Email not found", "email/username", username));

        return new CustomeUserDetails(optUser);
    }

    //Crear lista de roles de tipo Authority
    private Collection<? extends SimpleGrantedAuthority> getAuthorities(User user) {
        return user.getRoles().stream().map(
                role -> new SimpleGrantedAuthority(role.getName().toString())).toList();
    }

    /**
     * Verify Faild Attemps by User
     *
     * @param user: type {@link User}
     */
    @Transactional(noRollbackFor = {LockedException.class, BadCredentialsException.class, GlobalAppException.class})
    public void verifyFailedAttempts(User user) {
        if (user.isAccount_active() && user.isAccountNonLocked()) {
            if (user.getFailedAttempts() < AppConstants.MAX_LOGIN_ATTEMPTS) {
                this.increaseFaildAttemps(user);
                throw new BadCredentialsException("");
            } else {
                this.lockUser(user);
                throw new GlobalAppException(HttpStatus.UNAUTHORIZED,4015, "");
            }
        } else {
            this.verifyIsBlocked(user);
        }
    }

    public void verifyIsBlocked(User user){
        if (!user.isAccountNonLocked()) {
            boolean canUnlock = this.unlockUser(user);
            if (canUnlock) {
                throw new GlobalAppException(HttpStatus.UNAUTHORIZED,4013,"");
            } else {
                LocalDateTime timeLock = user.getLockeTime();
                long minutesLooked = UtilsCommons.differenceLocalDataTime(
                        LocalDateTime.now(), user.getLockeTime().plusMinutes(
                                NumberUtils.parseMillisToMunutes(AppConstants.BLOCK_DURATION))
                ) + 1;
                throw new GlobalAppException(HttpStatus.UNAUTHORIZED,4014, String.valueOf(minutesLooked));
            }
        }
    }
    /**
     * Increase Faild Attemps by User
     *
     * @param user: type {@link User}
     */
    public void increaseFaildAttemps(User user) {
        int failedAttempts = user.getFailedAttempts() + 1;
        this.userRepo.updateFailedAttempts(failedAttempts, user.getUsername());
    }

    /**
     * Block user for failed attempts
     *
     * @param user: type @{@link User}
     */
    private void lockUser(User user) {
        user.setAccountNonLocked(false);
        user.setLockeTime(LocalDateTime.now());
        this.userRepo.save(user);
    }

    /**
     * Evaluate whether to block the user for failed attempts
     *
     * @param user: type {@link User}
     */
    public boolean unlockUser(User user) {
        LocalDateTime lockTime = user.getLockeTime();
        if (lockTime != null) {
            long lockTimeMillis = lockTime.toInstant(ZoneOffset.UTC).toEpochMilli();
            long currentTimeInMillis = LocalDateTime.now().atZone(ZoneOffset.UTC).toInstant().toEpochMilli();
            long unlockTimeMillis = lockTimeMillis + AppConstants.BLOCK_DURATION;
            if (currentTimeInMillis > unlockTimeMillis) {
                user.setAccountNonLocked(true);
                user.setLockeTime(null);
                user.setFailedAttempts(0);
                this.userRepo.save(user);
                return true;
            }
        }
        return false;
    }

}
