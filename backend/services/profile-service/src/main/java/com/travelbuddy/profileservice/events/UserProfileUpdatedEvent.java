package com.travelbuddy.profileservice.events;

import java.util.UUID;

public record UserProfileUpdatedEvent(UUID userId) {}
