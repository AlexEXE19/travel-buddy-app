package com.travelbuddy.chatservice.events;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public record TripCreatedEvent(UUID tripId, UUID creatorId, String title) {}
