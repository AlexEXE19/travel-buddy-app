package com.travelbuddy.profileservice.service;

import com.travelbuddy.profileservice.dto.UserProfileUpdateRequest;
import com.travelbuddy.profileservice.entity.UserProfile;
import com.travelbuddy.profileservice.repository.UserProfileRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProfileService {

    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileService(UserProfileRepository userProfileRepository, PasswordEncoder passwordEncoder) {
        this.userProfileRepository = userProfileRepository;
        this.passwordEncoder = passwordEncoder;
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

    public boolean update(Integer id, UserProfileUpdateRequest dto) {
        // 1. Fetch the profile from the DB safely using Optional
        Optional<UserProfile> profileOptional = userProfileRepository.findById(Long.valueOf(id));

        // 2. If it doesn't exist, return false immediately
        if (profileOptional.isEmpty()) {
            return false;
        }

        // 3. Extract the entity from the Optional wrapper
        UserProfile userProfile = profileOptional.get();

        // 4. Update the entity's fields with the new values from the Record DTO
        userProfile.setFirstName(dto.firstName());
        userProfile.setLastName(dto.lastName());
        userProfile.setPhone(dto.phone());
        userProfile.setGender(dto.gender());
        userProfile.setNationality(dto.nationality());
        userProfile.setBudget(dto.budget());

        // 5. Save the updated entity back to the database
        userProfileRepository.save(userProfile);
        return true;
    }
}
