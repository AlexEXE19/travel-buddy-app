package com.travelbuddy.tripservice.events;

import com.travelbuddy.tripservice.enums.TripType;
import java.util.UUID;

public record TripCreatedEvent(
        UUID tripId,
        UUID creatorId,
        TripType type,
        Float estimatedBudget
) {}