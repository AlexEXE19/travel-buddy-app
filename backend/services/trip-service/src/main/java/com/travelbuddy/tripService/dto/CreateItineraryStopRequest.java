package com.travelbuddy.tripservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public record CreateItineraryStopRequest(

        @NotBlank(message = "Stop name is required")
        String name,

        @NotNull(message = "Latitude is required")
        Double latitude,

        @NotNull(message = "Longitude is required")
        Double longitude,

        int orderIndex,

        Instant arrivalDateTime,

        Instant departureDateTime
) {}