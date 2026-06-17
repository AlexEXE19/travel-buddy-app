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
import com.travelbuddy.profileservice.entity.Interest;
import com.travelbuddy.profileservice.repository.InterestRepository;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.UUID;

@Service
public class InterestService {

    private final InterestRepository interestRepository;
    private final UserProfileRepository userProfileRepository;

    public InterestService(InterestRepository interestRepository,
                           UserProfileRepository userProfileRepository) {
        this.interestRepository = interestRepository;
        this.userProfileRepository = userProfileRepository;
    }

    // get all available interests for the UI to display
    public List<Interest> getAllInterests() {
        return interestRepository.findAll();
    }

    // get this user's selected interests
    public Set<Interest> getUserInterests(String userId) {
        return userProfileRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"))
                .getInterests();
    }

    // replace user's interests with new selection
    public void updateUserInterests(String userId, List<UUID> interestIds) {
        UserProfile profile = userProfileRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Set<Interest> selected = new HashSet<>(interestRepository.findAllById(interestIds));
        profile.setInterests(selected);
        userProfileRepository.save(profile);
    }
}