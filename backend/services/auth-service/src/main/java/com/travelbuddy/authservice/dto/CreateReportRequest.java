package com.travelbuddy.authservice.dto;

import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record CreateReportRequest(
        @NotNull UUID reportedUserId,
        List<String> reasons,
        String details
) {}
