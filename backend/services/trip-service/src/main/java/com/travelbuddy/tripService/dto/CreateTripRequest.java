package com.travelbuddy.tripservice.dto;

import com.travelbuddy.tripservice.enums.TripType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CreateTripRequest(

        @NotNull(message = "Trip type is required")
        TripType type,

        UUID itineraryId,

        @NotNull(message = "Max capacity is required")
        @Min(value = 2, message = "Max capacity must be at least 2")
        int maxCapacity
) {}