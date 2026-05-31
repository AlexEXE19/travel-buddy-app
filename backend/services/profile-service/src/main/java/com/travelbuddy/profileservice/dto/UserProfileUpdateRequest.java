package com.travelbuddy.profileservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record UserProfileUpdateRequest(
        @NotBlank(message = "First name is required")
        @Size(max = 50, message = "First name must not exceed 50 characters")
        String firstName,

        @NotBlank(message = "Last name is required")
        @Size(max = 50, message = "Last name must not exceed 50 characters")
        String lastName,

        @Size(max = 20, message = "Phone number must not exceed 20 characters")
        String phone,

        @Size(max = 20, message = "Gender must not exceed 20 characters")
        String gender,

        @Size(max = 50, message = "Nationality must not exceed 50 characters")
        String nationality,

        @PositiveOrZero(message = "Budget must be a positive number or zero")
        Float budget
) {}