package com.travelbuddy.matchingservice.dto;

import java.util.List;

public record ProfileMatchingData(
        List<String> interests,
        String preferredTravelType,
        String preferredClimate,
        String preferredTransport,
        String preferredAccommodation,
        String budgetRange,
        String gender,
        boolean verified,
        String subscriptionStatus,
        boolean filterFemaleOnly,
        boolean filterVerifiedOnly
) {
    public boolean isPremium() {
        return "PREMIUM".equalsIgnoreCase(subscriptionStatus);
    }

    public String toEmbeddingText() {
        StringBuilder sb = new StringBuilder();

        if (interests != null && !interests.isEmpty())
            sb.append("Interests: ").append(String.join(", ", interests)).append(". ");
        if (preferredTravelType != null)
            sb.append("Prefers ").append(preferredTravelType.replace("_", " ").toLowerCase()).append(" travel. ");
        if (preferredClimate != null)
            sb.append("Prefers ").append(preferredClimate.toLowerCase()).append(" climate. ");
        if (preferredTransport != null)
            sb.append("Prefers ").append(preferredTransport.toLowerCase()).append(" transport. ");
        if (preferredAccommodation != null)
            sb.append("Prefers ").append(preferredAccommodation.replace("_", " ").toLowerCase()).append(" accommodation. ");
        if (budgetRange != null)
            sb.append("Budget level: ").append(budgetRange.toLowerCase()).append(".");

        return sb.toString().trim();
    }
}
