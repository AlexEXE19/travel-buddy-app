package com.travelbuddy.chatservice.events;

import java.util.UUID;

public record UserMatchedEvent(UUID userAId, UUID userBId) {}
