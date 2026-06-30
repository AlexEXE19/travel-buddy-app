package com.travelbuddy.authservice.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateAccountStatusRequest(
        @NotBlank String accountStatus
) {}
