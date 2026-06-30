package com.travelbuddy.tripservice.events;

import java.util.UUID;

public record TripCreatedEvent(
        UUID tripId,
        UUID creatorId,
        String tripType,
        String description,
        String title
) {}
