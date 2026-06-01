package com.travelbuddy.authservice.dto;

// AuthResponse.java
public record AuthResponse(
        boolean success,
        String message,
        String token
) {}