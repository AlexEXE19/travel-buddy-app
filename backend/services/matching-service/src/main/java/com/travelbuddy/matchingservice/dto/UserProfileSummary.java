package com.travelbuddy.matchingservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;
import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public record UserProfileSummary(
        UUID id,
        String firstName,
        String lastName,
        String profilePictureUrl,
        String bio,
        String nationality,
        String preferredTravelType,
        String gender,
        Boolean verified,
        List<String> interests,
        List<String> visitedPlaces,
        List<String> bucketListPlaces
) {}
