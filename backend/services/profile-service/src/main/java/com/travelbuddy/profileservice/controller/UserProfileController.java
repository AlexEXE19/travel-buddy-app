package com.travelbuddy.profileservice.controller;

import com.travelbuddy.profileservice.dto.MatchingClientResponse;
import com.travelbuddy.profileservice.dto.UserProfileUpdateRequest;
import com.travelbuddy.profileservice.entity.UserProfile;
import com.travelbuddy.profileservice.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/profile")
@Tag(name = "Profile", description = "User profile management")
public class UserProfileController {

    private final ProfileService profileService;

    public UserProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get the current user's full profile")
    public ResponseEntity<UserProfile> getMyProfile(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(profileService.getUserById(userId));
    }

    @PutMapping("/me")
    @Operation(summary = "Update the current user's profile")
    public ResponseEntity<String> updateMyProfile(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody UserProfileUpdateRequest dto) {
        boolean updated = profileService.update(userId, dto);
        return updated
                ? ResponseEntity.ok("Profile updated successfully!")
                : ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error updating profile");
    }

    @GetMapping("/for-matching")
    @Operation(summary = "Get profile data used for matching — intended for internal OpenFeign calls only")
    public ResponseEntity<MatchingClientResponse> getProfileForMatching(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(profileService.getUserForMatching(userId));
    }

    @PostMapping("/batch")
    @Operation(summary = "Batch fetch user profiles by list of IDs — internal use by matching service")
    public ResponseEntity<List<UserProfile>> getBatchProfiles(@RequestBody List<UUID> ids) {
        return ResponseEntity.ok(profileService.getBatchProfiles(ids));
    }

    @PostMapping("/me/subscribe")
    @Operation(summary = "Activate premium after a successful checkout")
    public ResponseEntity<String> subscribe(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(profileService.setSubscription(userId, "PREMIUM"));
    }

    @PostMapping("/me/cancel-subscription")
    @Operation(summary = "Cancel the premium subscription")
    public ResponseEntity<String> cancelSubscription(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(profileService.setSubscription(userId, "FREE"));
    }

    @PutMapping("/me/preferences")
    @Operation(summary = "Update discover filters (woman-to-woman / verified-only)")
    public ResponseEntity<java.util.Map<String, Boolean>> updatePreferences(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody java.util.Map<String, Boolean> body) {
        boolean femaleOnly = Boolean.TRUE.equals(body.get("femaleOnly"));
        boolean verifiedOnly = Boolean.TRUE.equals(body.get("verifiedOnly"));
        return ResponseEntity.ok(profileService.updatePreferences(userId, femaleOnly, verifiedOnly));
    }
}
