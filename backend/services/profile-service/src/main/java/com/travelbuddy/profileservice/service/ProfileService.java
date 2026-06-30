package com.travelbuddy.profileservice.service;

import com.travelbuddy.profileservice.config.RabbitConfig;
import com.travelbuddy.profileservice.dto.MatchingClientResponse;
import com.travelbuddy.profileservice.dto.UserProfileUpdateRequest;
import com.travelbuddy.profileservice.entity.UserProfile;
import com.travelbuddy.profileservice.events.UserProfileUpdatedEvent;
import com.travelbuddy.profileservice.repository.UserProfileRepository;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProfileService {

    private final UserProfileRepository userProfileRepository;
    private final AmqpTemplate amqpTemplate;

    public ProfileService(UserProfileRepository userProfileRepository, AmqpTemplate amqpTemplate) {
        this.userProfileRepository = userProfileRepository;
        this.amqpTemplate = amqpTemplate;
    }

    public UserProfile getUserById(String userId) {
        return userProfileRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public MatchingClientResponse getUserForMatching(String userId) {
        UserProfile profile = userProfileRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return new MatchingClientResponse(
                profile.getInterests(),
                profile.getPreferredTravelType(),
                profile.getPreferredClimate(),
                profile.getPreferredTransport(),
                profile.getPreferredAccommodation(),
                profile.getBudgetRange(),
                profile.getGender(),
                profile.isVerified(),
                profile.getSubscriptionStatus(),
                profile.isFilterFemaleOnly(),
                profile.isFilterVerifiedOnly()
        );
    }

    /** Update discover filter preferences, enforcing eligibility rules. */
    public java.util.Map<String, Boolean> updatePreferences(String userId, boolean femaleOnly, boolean verifiedOnly) {
        UserProfile profile = userProfileRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (femaleOnly && profile.getGender() != com.travelbuddy.profileservice.enums.Gender.FEMALE) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Only female travelers can enable woman-to-woman matching.");
        }
        if (verifiedOnly && !profile.isVerified()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Verify your account to filter by verified travelers.");
        }
        profile.setFilterFemaleOnly(femaleOnly);
        profile.setFilterVerifiedOnly(verifiedOnly);
        userProfileRepository.save(profile);
        return java.util.Map.of("femaleOnly", femaleOnly, "verifiedOnly", verifiedOnly);
    }

    public boolean update(String userId, UserProfileUpdateRequest dto) {
        UserProfile userProfile = userProfileRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        userProfile.setFirstName(dto.firstName());
        userProfile.setLastName(dto.lastName());
        userProfile.setPhone(dto.phone());
        userProfile.setGender(dto.gender());
        userProfile.setNationality(dto.nationality());
        userProfile.setCountryOfResidence(dto.countryOfResidence());
        userProfile.setCityOfResidence(dto.cityOfResidence());
        userProfile.setPreferredLanguage(dto.preferredLanguage());
        userProfile.setDateOfBirth(dto.dateOfBirth());
        userProfile.setBio(dto.bio());
        userProfile.setProfilePictureUrl(dto.profilePictureUrl());
        userProfile.setBudgetRange(dto.budgetRange());
        userProfile.setInterests(distinct(dto.interests()));
        userProfile.setPreferredTravelType(dto.preferredTravelType());
        userProfile.setPreferredClimate(dto.preferredClimate());
        userProfile.setPreferredTransport(dto.preferredTransport());
        userProfile.setPreferredAccommodation(dto.preferredAccommodation());
        userProfile.setVisitedPlaces(distinct(dto.visitedPlaces()));
        userProfile.setBucketListPlaces(distinct(dto.bucketListPlaces()));

        userProfileRepository.save(userProfile);

        amqpTemplate.convertAndSend(RabbitConfig.EXCHANGE, RabbitConfig.PROFILE_UPDATED_ROUTING_KEY,
                new UserProfileUpdatedEvent(UUID.fromString(userId)));

        return true;
    }

    public List<UserProfile> getBatchProfiles(List<UUID> ids) {
        return userProfileRepository.findAllById(ids);
    }

    /** Admin: list all profiles for the verification screen. */
    public List<com.travelbuddy.profileservice.dto.AdminProfileSummary> listAllForAdmin() {
        return userProfileRepository.findAll().stream()
                .map(com.travelbuddy.profileservice.dto.AdminProfileSummary::from)
                .collect(Collectors.toList());
    }

    /** Admin: mark a profile verified / unverified after inspecting it. */
    public com.travelbuddy.profileservice.dto.AdminProfileSummary setVerified(String userId, boolean verified) {
        UserProfile profile = userProfileRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        profile.setVerified(verified);
        userProfileRepository.save(profile);
        return com.travelbuddy.profileservice.dto.AdminProfileSummary.from(profile);
    }

    /** Activate the premium subscription for a user (after a successful checkout). */
    public String setSubscription(String userId, String status) {
        UserProfile profile = userProfileRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        profile.setSubscriptionStatus(status);
        userProfileRepository.save(profile);
        return profile.getSubscriptionStatus();
    }

    /** Remove duplicates while preserving order; null-safe. */
    private List<String> distinct(List<String> values) {
        if (values == null) return new ArrayList<>();
        return values.stream()
                .filter(v -> v != null && !v.isBlank())
                .distinct()
                .collect(Collectors.toList());
    }
}
