package com.travelbuddy.authservice.service;

import com.travelbuddy.authservice.entity.UserCredentials;
import com.travelbuddy.authservice.events.UserRegisteredEvent;
import com.travelbuddy.authservice.repository.UserCredentialsRepository;
import com.travelbuddy.authservice.util.JwtUtil;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.security.authentication.BadCredentialsException;
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

        return jwtUtil.generateToken(userCredentials.getId().toString());
    }

    public String register(String email, String rawPassword) {
        if (userCredentialsRepository.existsByEmail(email)) throw new BadCredentialsException("Email already in use");

        UserCredentials userCredentials = new UserCredentials();
        userCredentials.setEmail(email);
        userCredentials.setPasswordHash(passwordEncoder.encode(rawPassword));

        try {

            userCredentialsRepository.save(userCredentials);

            rabbitTemplate.convertAndSend(
                    "user.exchange",
                    "user.created",
                    new UserRegisteredEvent(userCredentials.getId().toString())
            );

        } catch (Exception e) {
            throw new RuntimeException("Could not complete registration. Please try again.");
        }
        return jwtUtil.generateToken(userCredentials.getId().toString());

    }
}
