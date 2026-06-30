package com.travelbuddy.matchingservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;
import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public record TripSummaryResponse(
        UUID id,
        String title,
        String description,
        String tripType,
        String status,
        int maxCapacity,
        UUID creatorId,
        List<UUID> members,
        ItinerarySummary itinerary
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record ItinerarySummary(
            UUID id,
            String startLocationName,
            String startDateTime,
            String endDateTime,
            Double startLat,
            Double startLng
    ) {}
}
