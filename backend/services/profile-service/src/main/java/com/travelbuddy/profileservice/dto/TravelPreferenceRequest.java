package com.travelbuddy.profileservice.dto;

import jakarta.validation.constraints.Size;

public record TravelPreferenceRequest(

        @Size(max = 50)
        String preferredTravelType,

        @Size(max = 50)
        String preferredClimate,

        @Size(max = 50)
        String preferredTransport,

        @Size(max = 50)
        String preferredAccommodation
) {}