package com.travelbuddy.authservice.controller;

import com.travelbuddy.authservice.dto.AuthResponse;
import com.travelbuddy.authservice.dto.LoginRequest;
import com.travelbuddy.authservice.dto.RegisterRequest;
import com.travelbuddy.authservice.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Register and login endpoints")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "Login with email and password")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {

        String token = authService.login(loginRequest.email(), loginRequest.password());

        Cookie authCookie = new Cookie("AUTH_TOKEN", token);
        authCookie.setHttpOnly(true);
//        authCookie.setSecure(true);
        authCookie.setPath("/");
        authCookie.setMaxAge(15*50*1000);

        response.addCookie(authCookie);

            return ResponseEntity.ok(new AuthResponse(true, "Login successful!", token));

    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user account")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest, HttpServletResponse response) {

        String token = authService.register(registerRequest.email(), registerRequest.password());

        Cookie authCookie = new Cookie("AUTH_TOKEN", token);
        authCookie.setHttpOnly(true);
        authCookie.setPath("/");
        authCookie.setMaxAge(15 * 50 * 1000);
        response.addCookie(authCookie);

        return ResponseEntity.ok(new AuthResponse(true, "Register successful!", token));

    }
}
