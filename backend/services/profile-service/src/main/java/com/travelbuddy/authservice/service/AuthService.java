package com.travelbuddy.authservice.service;

import com.travelbuddy.authservice.entity.UserCredentials;
import com.travelbuddy.authservice.repository.UserCredentialsRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserCredentialsRepository userCredentialsRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserCredentialsRepository userCredentialsRepository, PasswordEncoder passwordEncoder) {
        this.userCredentialsRepository = userCredentialsRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public boolean login(String email, String rawPassword) {
        UserCredentials userCredentials = userCredentialsRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String hashedPasswordFromDb = userCredentials.getPasswordHash();

        return passwordEncoder.matches(rawPassword, hashedPasswordFromDb);
    }

    public boolean register(String email, String rawPassword) {
        if (userCredentialsRepository.existsByEmail(email)) return false;

        UserCredentials userCredentials = new UserCredentials();
        userCredentials.setEmail(email);
        userCredentials.setPasswordHash(passwordEncoder.encode(rawPassword));

        userCredentialsRepository.save(userCredentials);
        return true;
    }
}
