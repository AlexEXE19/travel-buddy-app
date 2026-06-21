package com.travelbuddy.tripservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.List;

public record CreateItineraryRequest(

        @NotNull(message = "Start time is required")
        Instant startDateTime,

        @NotBlank(message = "Start location name is required")
        String startLocationName,

        @NotNull(message = "Start latitude is required")
        Double startLat,

        @NotNull(message = "Start longitude is required")
        Double startLng,

        Instant endDateTime,

        @Size(max = 5, message = "Maximum 5 stops allowed")
        List<CreateItineraryStopRequest> stops
) {}