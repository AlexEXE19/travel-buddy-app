package com.travelbuddy.chatservice.events;

import java.util.UUID;

public record UserJoinedTripEvent(UUID tripId, UUID userId, String tripTitle) {}
