package com.travelbuddy.authservice.service;

import com.travelbuddy.authservice.entity.AccountStatus;
import com.travelbuddy.authservice.entity.Role;
import com.travelbuddy.authservice.entity.UserCredentials;
import com.travelbuddy.authservice.events.UserRegisteredEvent;
import com.travelbuddy.authservice.exception.EmailAlreadyInUseException;
import com.travelbuddy.authservice.repository.UserCredentialsRepository;
import com.travelbuddy.authservice.util.JwtUtil;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserCredentialsRepository userCredentialsRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RabbitTemplate rabbitTemplate;

    public AuthService(UserCredentialsRepository userCredentialsRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, RabbitTemplate rabbitTemplate) {
        this.userCredentialsRepository = userCredentialsRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.rabbitTemplate = rabbitTemplate;
    }

    public String login(String email, String rawPassword) {
        UserCredentials userCredentials = userCredentialsRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        String hashedPasswordFromDb = userCredentials.getPasswordHash();

        if(!passwordEncoder.matches(rawPassword, hashedPasswordFromDb)) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String status = userCredentials.getAccountStatus();
        if (AccountStatus.BANNED.equals(status) || AccountStatus.SUSPENDED.equals(status)) {
            throw new DisabledException("This account is " + status.toLowerCase() + ".");
        }

        return jwtUtil.generateToken(userCredentials.getId().toString(), roleOf(userCredentials));
    }

    public String register(String email, String rawPassword) {
        if (userCredentialsRepository.existsByEmail(email)) throw new EmailAlreadyInUseException("Email already in use");

        UserCredentials userCredentials = new UserCredentials();
        userCredentials.setEmail(email);
        userCredentials.setPasswordHash(passwordEncoder.encode(rawPassword));
        userCredentials.setAccountStatus(AccountStatus.ACTIVE);
        userCredentials.setRole(Role.USER);

        try {

            userCredentialsRepository.save(userCredentials);

            rabbitTemplate.convertAndSend(
                    "user.exchange",
                    "user.created",
                    new UserRegisteredEvent(userCredentials.getId())
            );

        } catch (Exception e) {
            throw new RuntimeException("Could not complete registration. Please try again.");
        }
        return jwtUtil.generateToken(userCredentials.getId().toString(), Role.USER);

    }

    private String roleOf(UserCredentials u) {
        return u.getRole() == null ? Role.USER : u.getRole();
    }
}
