package com.travelbuddy.profileservice.controller;

import com.travelbuddy.profileservice.dto.UserProfileUpdateRequest;
import com.travelbuddy.profileservice.service.ProfileService;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/v1/profile")
public class UserProfileController {

    private final ProfileService profileService;

    public UserProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createProfile(@Valid @RequestBody UserProfileUpdateRequest userProfileUpdateRequest) {

        boolean isCreated = profileService.create(userProfileUpdateRequest);

        if (isCreated) {
            return ResponseEntity.ok("Profile creation successful!");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error creating profile");
        }
    }
    @PutMapping("/update/{id}")

    public ResponseEntity<String> updateProfile(@PathVariable Integer id, @Valid @RequestBody UserProfileUpdateRequest userProfileUpdateRequest) {

        boolean updated = profileService.update(id, userProfileUpdateRequest);

        if (updated) {
            return ResponseEntity.ok("Update successful!");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error updating profile");
        }
    }
}