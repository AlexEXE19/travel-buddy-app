package com.travelbuddy.profileservice.dto;

import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record UserProfileUpdateRequest(

        @Size(max = 50, message = "First name must not exceed 50 characters")
        String firstName,

        @Size(max = 50, message = "Last name must not exceed 50 characters")
        String lastName,

        @Size(max = 20, message = "Phone number must not exceed 20 characters")
        String phone,

        @Size(max = 20, message = "Gender must not exceed 20 characters")
        String gender,

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

        @Size(max = 500, message = "URL must not exceed 500 characters")
        String profilePictureUrl,

        @Size(max = 1000, message = "Interests should not exceed 1000 characters")
        String interests,

        @Size(max = 50, message = "Preferred travel type should not exceed 50 characters")
        String preferredTravelType,

        @Size(max = 50, message = "Preferred climate should not exceed 50 characters")
        String preferredClimate,

        @Size(max = 50, message = "Preferred transport should not exceed 50 characters")
        String preferredTransport,

        @Size(max = 50, message = "Preferred accommodation should not exceed 50 characters")
        String preferredAccommodation,

        @PositiveOrZero(message = "Budget must be a positive number or zero")
        Float budget
) {}