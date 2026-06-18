package com.travelbuddy.tripservice.dto;

import com.travelbuddy.tripservice.enums.TripType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.UUID; 

public record CreateTripRequest(

        @NotBlank(message = "Title is required")
        @Size(max = 100)
        String title,

        @Size(max = 1000)
        String description,

        @NotNull(message = "Trip type is required")
        TripType type,

        @NotNull(message = "Start date is required")
        LocalDate startDate,

        UUID itineraryId, // Now compiles perfectly

        @NotNull(message = "Max capacity is required")
        @Min(value = 2, message = "Max capacity must be at least 2")
        int maxCapacity
) {}