package com.travelbuddy.matchingservice.dto;

import java.util.UUID;

public record SwipeRequest(UUID targetUserId, String action) {}
