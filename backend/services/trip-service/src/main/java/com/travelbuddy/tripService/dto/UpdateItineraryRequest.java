package com.travelbuddy.tripservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;


public record UpdateItineraryRequest(

        @Size(max = 100)
        String destination,

        @Size(max = 100)
        String country,


        @Min(value = 1)
        Integer duration,

        Float estimatedBudget
) {}