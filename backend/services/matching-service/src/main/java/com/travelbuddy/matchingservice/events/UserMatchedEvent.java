package com.travelbuddy.matchingservice.events;

import java.util.UUID;

public record UserMatchedEvent(UUID userAId, UUID userBId) {}
