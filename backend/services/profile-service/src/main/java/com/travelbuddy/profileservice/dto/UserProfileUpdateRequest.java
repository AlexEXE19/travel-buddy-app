package com.travelbuddy.profileservice.dto;

import com.travelbuddy.profileservice.enums.*;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

public record UserProfileUpdateRequest(

        @Size(max = 50, message = "First name must not exceed 50 characters")
        String firstName,

        @Size(max = 50, message = "Last name must not exceed 50 characters")
        String lastName,

        @Size(max = 20, message = "Phone number must not exceed 20 characters")
        String phone,

        Gender gender,

        @Size(max = 50, message = "Nationality must not exceed 50 characters")
        String nationality,

        @Size(max = 100, message = "Country must not exceed 100 characters")
        String countryOfResidence,

        @Size(max = 100, message = "City must not exceed 100 characters")
        String cityOfResidence,

        @Size(max = 50, message = "Language must not exceed 50 characters")
        String preferredLanguage,

        LocalDate dateOfBirth,

        @Size(max = 1000, message = "Bio must not exceed 1000 characters")
        String bio,

        @Size(max = 500, message = "Profile picture URL must not exceed 500 characters")
        String profilePictureUrl,

        List<String> interests,

        PreferredTravelType preferredTravelType,

        PreferredClimate preferredClimate,

        PreferredTransport preferredTransport,

        PreferredAccommodation preferredAccommodation,

        BudgetRange budgetRange,

        List<String> visitedPlaces,
        List<String> bucketListPlaces
) {}
