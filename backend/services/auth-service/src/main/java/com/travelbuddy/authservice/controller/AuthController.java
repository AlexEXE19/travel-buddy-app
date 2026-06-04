package com.travelbuddy.authservice.controller;

import com.travelbuddy.authservice.dto.AuthResponse;
import com.travelbuddy.authservice.dto.LoginRequest;
import com.travelbuddy.authservice.dto.RegisterRequest;
import com.travelbuddy.authservice.service.AuthService;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {

        String token = authService.login(loginRequest.email(), loginRequest.password());

            return ResponseEntity.ok(new AuthResponse(true, "Login successful!", token));

    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {

        String token = authService.register(registerRequest.email(), registerRequest.password());

            return ResponseEntity.ok(new AuthResponse(true, "Register successful!", token));

    }
}