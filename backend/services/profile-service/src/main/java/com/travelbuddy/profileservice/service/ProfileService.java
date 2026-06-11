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
        UserProfile userProfile = userProfileRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return userProfile;
    }

    public boolean create(UserProfileUpdateRequest dto) {
        UserProfile userProfile = new UserProfile();
        userProfile.setFirstName(dto.firstName());
        userProfile.setLastName(dto.lastName());
        userProfile.setPhone(dto.phone());
        userProfile.setGender(dto.gender());
        userProfile.setNationality(dto.nationality());
        userProfile.setBudget(dto.budget());

        userProfileRepository.save(userProfile);
        return true;
    }

    public boolean update(String userId, UserProfileUpdateRequest dto) {
        Optional<UserProfile> profileOptional = userProfileRepository.findById(UUID.fromString(userId));

        if (profileOptional.isEmpty()) {
            return false;
        }

        UserProfile userProfile = profileOptional.get();

        userProfile.setFirstName(dto.firstName());
        userProfile.setLastName(dto.lastName());
        userProfile.setPhone(dto.phone());
        userProfile.setGender(dto.gender());
        userProfile.setNationality(dto.nationality());
        userProfile.setBudget(dto.budget());

        userProfileRepository.save(userProfile);
        return true;
    }
}
