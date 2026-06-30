package com.travelbuddy.authservice.controller;

import com.travelbuddy.authservice.dto.AuthResponse;
import com.travelbuddy.authservice.dto.LoginRequest;
import com.travelbuddy.authservice.dto.RegisterRequest;
import com.travelbuddy.authservice.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Register and login endpoints")
public class AuthController {

    /** Session cookie lifetime; also bounds how long a stolen cookie stays usable. */
    private static final int COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 hours

    private final AuthService authService;

    /** Send the cookie only over HTTPS in real deployments; off by default for local http. */
    @Value("${app.cookie.secure:false}")
    private boolean cookieSecure;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    private Cookie buildAuthCookie(String token) {
        Cookie authCookie = new Cookie("AUTH_TOKEN", token);
        authCookie.setHttpOnly(true);          // not readable from JavaScript (XSS token theft)
        authCookie.setSecure(cookieSecure);    // HTTPS-only when enabled
        authCookie.setPath("/");
        authCookie.setAttribute("SameSite", "Lax"); // mitigates cross-site request forgery
        authCookie.setMaxAge(COOKIE_MAX_AGE_SECONDS);
        return authCookie;
    }

    @PostMapping("/login")
    @Operation(summary = "Login with email and password")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {

        String token = authService.login(loginRequest.email(), loginRequest.password());
        response.addCookie(buildAuthCookie(token));

        return ResponseEntity.ok(new AuthResponse(true, "Login successful!", token));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user account")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest, HttpServletResponse response) {

        String token = authService.register(registerRequest.email(), registerRequest.password());
        response.addCookie(buildAuthCookie(token));

        return ResponseEntity.ok(new AuthResponse(true, "Register successful!", token));
    }
}
