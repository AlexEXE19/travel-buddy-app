package com.travelbuddy.matchingService.controller;

import com.travelbuddy.matchingService.dto.UserProfileUpdateRequest;
import com.travelbuddy.matchingService.entity.UserProfile;
import com.travelbuddy.matchingService.repository.UserProfileRepository;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.travelbuddy.matchingService.entity.Interest;
import com.travelbuddy.matchingService.entity.TravelPreference;
import com.travelbuddy.matchingService.service.InterestService;
import com.travelbuddy.matchingService.service.TravelPreferenceService;
import com.travelbuddy.matchingService.dto.TravelPreferenceRequest;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/matching")
public class MatchingController {

    private final MatchingService matchingService;
    private final TravelPreferenceService travelPreferenceService;
    private final InterestService interestService;

    public MatchingController(ProfileService profileService,
                                  TravelPreferenceService travelPreferenceService,
                                  InterestService interestService) {
        this.profileService = profileService;
        this.travelPreferenceService = travelPreferenceService;
        this.interestService = interestService;
    }

    @GetMapping("/discover")
    public ResponseEntity<List<UUID>> getDiscoveryFeed(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(defaultValue = "10") int limit) {
        
        List<UUID> recommendedTripIds = matchingService.getRealTimeRecommendations(
                UUID.fromString(userId), 
                limit
        );
        
        return ResponseEntity.ok(recommendedTripIds);
    }

    


}
