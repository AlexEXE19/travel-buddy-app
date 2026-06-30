package com.travelbuddy.profileservice.dto;

import com.travelbuddy.profileservice.enums.*;

import java.util.List;

public record MatchingClientResponse(
        List<String> interests,
        PreferredTravelType preferredTravelType,
        PreferredClimate preferredClimate,
        PreferredTransport preferredTransport,
        PreferredAccommodation preferredAccommodation,
        BudgetRange budgetRange,
        Gender gender,
        boolean verified,
        String subscriptionStatus,
        boolean filterFemaleOnly,
        boolean filterVerifiedOnly
) {
    public String toEmbeddingText() {
        StringBuilder sb = new StringBuilder();

        if (interests != null && !interests.isEmpty())
            sb.append("Interests: ").append(String.join(", ", interests)).append(". ");
        if (preferredTravelType != null)
            sb.append("Prefers ").append(preferredTravelType.name().replace("_", " ").toLowerCase()).append(" travel. ");
        if (preferredClimate != null)
            sb.append("Prefers ").append(preferredClimate.name().toLowerCase()).append(" climate. ");
        if (preferredTransport != null)
            sb.append("Prefers ").append(preferredTransport.name().toLowerCase()).append(" transport. ");
        if (preferredAccommodation != null)
            sb.append("Prefers ").append(preferredAccommodation.name().replace("_", " ").toLowerCase()).append(" accommodation. ");
        if (budgetRange != null)
            sb.append("Budget level: ").append(budgetRange.name().toLowerCase()).append(".");

        return sb.toString().trim();
    }
}
