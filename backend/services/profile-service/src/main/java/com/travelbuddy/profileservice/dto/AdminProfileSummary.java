package com.travelbuddy.profileservice.dto;

import com.travelbuddy.profileservice.entity.UserProfile;

import java.util.UUID;

/** Compact profile view for the admin verification screen. */
public record AdminProfileSummary(
        UUID userId,
        String firstName,
        String lastName,
        String profilePictureUrl,
        String gender,
        String nationality,
        String bio,
        boolean verified
) {
    public static AdminProfileSummary from(UserProfile p) {
        return new AdminProfileSummary(
                p.getId(),
                p.getFirstName(),
                p.getLastName(),
                p.getProfilePictureUrl(),
                p.getGender() == null ? null : p.getGender().name(),
                p.getNationality(),
                p.getBio(),
                p.isVerified()
        );
    }
}
