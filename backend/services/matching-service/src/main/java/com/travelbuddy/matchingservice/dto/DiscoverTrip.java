package com.travelbuddy.matchingservice.dto;

import java.util.UUID;

/** A compact trip card shown on a traveler's discover/match profile. */
public record DiscoverTrip(
        UUID id,
        String title,
        String tripType,
        String startLocationName,
        String startDateTime
) {}
