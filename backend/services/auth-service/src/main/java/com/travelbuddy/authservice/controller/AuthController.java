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

        boolean isAuthenticated = authService.login(loginRequest.email(), loginRequest.password());

        if (isAuthenticated) {
            return ResponseEntity.ok(new AuthResponse(true, "Login successful!", null));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(false, "Invalid email or password", null));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {

        boolean registered = authService.register(registerRequest.email(), registerRequest.password());

        if (registered) {
            return ResponseEntity.ok(new AuthResponse(true, "Register successful!", null));
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new AuthResponse(false, "Email already exists", null));
        }
    }
}