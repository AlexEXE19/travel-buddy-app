package com.travelbuddy.profileservice.controller;

import com.travelbuddy.profileservice.dto.UserProfileUpdateRequest;
import com.travelbuddy.profileservice.dto.MatchingClientResponse;

import com.travelbuddy.profileservice.entity.UserProfile;
import com.travelbuddy.profileservice.repository.UserProfileRepository;
import com.travelbuddy.profileservice.service.ProfileService;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/profile")
public class UserProfileController {

    private final ProfileService profileService;

    public UserProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    // ── Profile ──────────────────────────────────────────

    @GetMapping("/me")
    public ResponseEntity<UserProfile> getMyProfile(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(profileService.getUserById(userId));
    }

    @PutMapping("/me")
    public ResponseEntity<String> updateMyProfile(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody UserProfileUpdateRequest dto) {
        boolean updated = profileService.update(userId, dto);
        return updated
                ? ResponseEntity.ok("Profile updated successfully!")
                : ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error updating profile");
    }

    @GetMapping("/for-matching")
    public ResponseEntity<MatchingClientResponse> getProfileForMatching(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(profileService.getUserForMatchingById(userId));
    }


}
