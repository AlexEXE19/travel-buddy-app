package com.travelbuddy.authservice.service;

import com.travelbuddy.authservice.entity.UserCredentials;
import com.travelbuddy.authservice.repository.UserCredentialsRepository;
import com.travelbuddy.authservice.util.JwtUtil;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserCredentialsRepository userCredentialsRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserCredentialsRepository userCredentialsRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userCredentialsRepository = userCredentialsRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public String login(String email, String rawPassword) {
        UserCredentials userCredentials = userCredentialsRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        String hashedPasswordFromDb = userCredentials.getPasswordHash();

        if(!passwordEncoder.matches(rawPassword, hashedPasswordFromDb)) {
            throw new BadCredentialsException("Invalid email or password");
        }

        return jwtUtil.generateToken(email);
    }

    public String register(String email, String rawPassword) {
        if (userCredentialsRepository.existsByEmail(email)) throw new BadCredentialsException("Email already in use");

        UserCredentials userCredentials = new UserCredentials();
        userCredentials.setEmail(email);
        userCredentials.setPasswordHash(passwordEncoder.encode(rawPassword));

        try {

            userCredentialsRepository.save(userCredentials);

        } catch (Exception e) {
            throw new RuntimeException("Could not complete registration. Please try again.");
        }
        return jwtUtil.generateToken(email);
    }
}
