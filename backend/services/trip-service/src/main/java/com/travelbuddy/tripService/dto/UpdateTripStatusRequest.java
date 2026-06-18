package com.travelbuddy.tripservice.dto;

import com.travelbuddy.tripservice.enums.TripStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateTripStatusRequest(

        @NotNull(message = "Status is required")
        TripStatus status
) {}