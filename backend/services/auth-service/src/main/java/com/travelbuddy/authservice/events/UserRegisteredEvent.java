package com.travelbuddy.authservice.events;

import java.util.UUID;

public record UserRegisteredEvent(UUID userId) {}
