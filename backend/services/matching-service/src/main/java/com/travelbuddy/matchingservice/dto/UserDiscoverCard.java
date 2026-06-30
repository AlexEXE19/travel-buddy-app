package com.travelbuddy.matchingservice.dto;

import java.util.List;
import java.util.UUID;

public record UserDiscoverCard(
        UUID userId,
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
        List<String> bucketListPlaces,
        List<DiscoverTrip> openTrips
) {}
