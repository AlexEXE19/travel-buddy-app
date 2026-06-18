package com.travelbuddy.tripservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record CreateItineraryRequest(

        @NotBlank(message = "Destination is required")
        String destination,

        @NotBlank(message = "Country is required")
        String country,

        @Min(value = 1, message = "Duration must be at least 1 day")
        int duration,

        Float estimatedBudget
) {}