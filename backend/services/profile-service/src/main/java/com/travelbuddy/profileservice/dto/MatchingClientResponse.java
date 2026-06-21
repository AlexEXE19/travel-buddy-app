package com.travelbuddy.profileservice.dto;

import java.util.UUID;
import lombok.Builder;

@Builder
public record MatchingClientResponse(
        UUID id,
        String bio,
        String interests,
        String preferredTravelType,
        String preferredClimate,
        String preferredTransport,
        String preferredAccommodation,
        String nationality,
        String cityOfResidence,
        String countryOfResidence,
        String preferredLanguage
) {
    public String toEmbeddingText() {
        StringBuilder sb = new StringBuilder();

        if (bio != null && !bio.isBlank()) sb.append("Bio: ").append(bio).append(". ");
        if (interests != null && !interests.isBlank()) sb.append("Interests: ").append(interests).append(". ");
        if (preferredTravelType != null && !preferredTravelType.isBlank()) sb.append("Prefers ").append(preferredTravelType).append(" travel. ");
        if (preferredClimate != null && !preferredClimate.isBlank()) sb.append("Prefers ").append(preferredClimate).append(" climates. ");
        if (preferredTransport != null && !preferredTransport.isBlank()) sb.append("Prefers ").append(preferredTransport).append(" transportation. ");
        if (preferredAccommodation != null && !preferredAccommodation.isBlank()) sb.append("Prefers staying in ").append(preferredAccommodation).append(". ");
        if (nationality != null && !nationality.isBlank()) sb.append("Nationality is ").append(nationality).append(". ");
        if (cityOfResidence != null && !cityOfResidence.isBlank()) sb.append("Lives in ").append(cityOfResidence);
        if (countryOfResidence != null && !countryOfResidence.isBlank()) sb.append(", ").append(countryOfResidence).append(". ");
        if (preferredLanguage != null && !preferredLanguage.isBlank()) sb.append("Speaks ").append(preferredLanguage).append(".");

        return sb.toString().trim();
    }
}