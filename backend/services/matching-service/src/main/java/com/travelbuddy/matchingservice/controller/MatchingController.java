package com.travelbuddy.matchingservice.controller;

import com.travelbuddy.matchingservice.service.MatchingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/matching")
public class MatchingController {

    private final MatchingService matchingService;

    public MatchingController(MatchingService matchingService) {
        this.matchingService = matchingService;
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