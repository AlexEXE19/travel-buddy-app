package com.travelbuddy.profileservice.controller;

import com.travelbuddy.profileservice.dto.UserProfileUpdateRequest;
import com.travelbuddy.profileservice.entity.UserProfile;
import com.travelbuddy.profileservice.repository.UserProfileRepository;
import com.travelbuddy.profileservice.service.ProfileService;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.travelbuddy.profileservice.entity.Interest;
import com.travelbuddy.profileservice.entity.TravelPreference;
import com.travelbuddy.profileservice.service.InterestService;
import com.travelbuddy.profileservice.service.TravelPreferenceService;
import com.travelbuddy.profileservice.dto.TravelPreferenceRequest;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/profile")
public class UserProfileController {

    private final ProfileService profileService;
    private final TravelPreferenceService travelPreferenceService;
    private final InterestService interestService;

    public UserProfileController(ProfileService profileService,
                                  TravelPreferenceService travelPreferenceService,
                                  InterestService interestService) {
        this.profileService = profileService;
        this.travelPreferenceService = travelPreferenceService;
        this.interestService = interestService;
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

    // ── Travel Preferences ───────────────────────────────

    @GetMapping("/me/preferences")
    public ResponseEntity<TravelPreference> getMyPreferences(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(travelPreferenceService.getByUserId(userId));
    }

    @PutMapping("/me/preferences")
    public ResponseEntity<String> updateMyPreferences(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody TravelPreferenceRequest dto) {
        travelPreferenceService.update(userId, dto);
        return ResponseEntity.ok("Preferences updated successfully!");
    }

    // ── Interests ────────────────────────────────────────

   // get all available interests (for the UI dropdown/picker)
@GetMapping("/interests")
public ResponseEntity<List<Interest>> getAllInterests() {
    return ResponseEntity.ok(interestService.getAllInterests());
}

// get current user's selected interests
@GetMapping("/me/interests")
public ResponseEntity<Set<Interest>> getMyInterests(
        @RequestHeader("X-User-Id") String userId) {
    return ResponseEntity.ok(interestService.getUserInterests(userId));
}

// update current user's selected interests (send full list of selected IDs)
@PutMapping("/me/interests")
public ResponseEntity<String> updateMyInterests(
        @RequestHeader("X-User-Id") String userId,
        @RequestBody List<UUID> interestIds) {
    interestService.updateUserInterests(userId, interestIds);
    return ResponseEntity.ok("Interests updated!");
}
}
