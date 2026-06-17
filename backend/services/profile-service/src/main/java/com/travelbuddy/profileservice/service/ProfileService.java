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

@Service
public class ProfileService {

    private final UserProfileRepository userProfileRepository;

    public ProfileService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    public UserProfile getUserById(String userId) {
        return userProfileRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
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
        userProfile.setBudget(dto.budget());

        userProfileRepository.save(userProfile);
        return true;
    }
}
