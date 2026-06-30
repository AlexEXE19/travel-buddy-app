package com.travelbuddy.tripservice.client;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ProfileSummary(
        UUID id,
        String gender,
        String subscriptionStatus,
        boolean verified
) {
    public boolean isPremium() {
        return "PREMIUM".equalsIgnoreCase(subscriptionStatus);
    }

    public boolean isFemale() {
        return "FEMALE".equalsIgnoreCase(gender);
    }
}
