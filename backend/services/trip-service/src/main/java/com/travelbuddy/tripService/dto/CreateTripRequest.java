package com.travelbuddy.tripservice.dto;

import com.travelbuddy.tripservice.enums.TripType;
import jakarta.validation.constraints.*;


public record CreateTripRequest(

        @NotBlank(message = "Title is required")
        @Size(max = 100)
        String title,

        @Size(max = 1000)
        String description,

        @NotNull(message = "Trip type is required")
        TripType tripType,

        @NotNull(message = "Max capacity is required")
        @Min(value = 2, message = "Must have at least 2 people")
        @Max(value = 5, message = "Cannot exceed 5 people")
        int maxCapacity,

        boolean womenOnly,

        @NotNull(message = "Itinerary is required")
        CreateItineraryRequest itinerary
) {}
