package com.travelbuddy.authservice.dto;

import com.travelbuddy.authservice.entity.UserCredentials;

import java.time.LocalDateTime;
import java.util.UUID;

public record AdminUserResponse(
        UUID id,
        String email,
        String accountStatus,
        String role,
        LocalDateTime createdAt
) {
    public static AdminUserResponse from(UserCredentials u) {
        return new AdminUserResponse(
                u.getId(), u.getEmail(), u.getAccountStatus(), u.getRole(), u.getCreatedAt()
        );
    }
}
