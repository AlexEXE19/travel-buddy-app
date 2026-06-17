package com.travelbuddy.profileservice.service;

import com.travelbuddy.profileservice.dto.UserProfileUpdateRequest;
import com.travelbuddy.profileservice.entity.UserProfile;
import com.travelbuddy.profileservice.repository.UserProfileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.UUID;

import com.travelbuddy.profileservice.entity.TravelPreference;
import com.travelbuddy.profileservice.repository.TravelPreferenceRepository;
import com.travelbuddy.profileservice.dto.TravelPreferenceRequest;


@Service
public class TravelPreferenceService {

    private final TravelPreferenceRepository travelPreferenceRepository;
    private final UserProfileRepository userProfileRepository;

    public TravelPreferenceService(TravelPreferenceRepository travelPreferenceRepository,
                                    UserProfileRepository userProfileRepository) {
        this.travelPreferenceRepository = travelPreferenceRepository;
        this.userProfileRepository = userProfileRepository;
    }

    public TravelPreference getByUserId(String userId) {
        UserProfile profile = userProfileRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return travelPreferenceRepository.findByProfile(profile)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Preferences not found"));
    }

    public void update(String userId, TravelPreferenceRequest dto) {
        UserProfile profile = userProfileRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        TravelPreference preference = travelPreferenceRepository.findByProfile(profile)
                .orElse(new TravelPreference());

        preference.setProfile(profile);
        preference.setTravelStyle(dto.travelStyle());
        preference.setPreferredClimate(dto.preferredClimate());
        preference.setPreferredTransport(dto.preferredTransport());
        preference.setPreferredAccommodation(dto.preferredAccommodation());

        travelPreferenceRepository.save(preference);
    }
}