package com.travelbuddy.matchingservice.controller;

import com.travelbuddy.matchingservice.dto.SwipeRequest;
import com.travelbuddy.matchingservice.dto.TripSummaryResponse;
import com.travelbuddy.matchingservice.dto.UserDiscoverCard;
import com.travelbuddy.matchingservice.service.MatchingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/matching")
@Tag(name = "Matching", description = "Trip discovery based on user preference embeddings")
public class MatchingController {

    private final MatchingService matchingService;

    public MatchingController(MatchingService matchingService) {
        this.matchingService = matchingService;
    }

    @GetMapping("/discover")
    @Operation(summary = "Get recommended trips for the current user based on preference similarity")
    public ResponseEntity<List<TripSummaryResponse>> getDiscoveryFeed(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(defaultValue = "10") int limit) {

        List<TripSummaryResponse> trips = matchingService.getRecommendations(
                UUID.fromString(userId),
                limit
        );

        return ResponseEntity.ok(trips);
    }

    @GetMapping("/discover/users")
    @Operation(summary = "Get recommended user profiles for the current user based on preference similarity")
    public ResponseEntity<List<UserDiscoverCard>> getUserDiscoveryFeed(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(defaultValue = "10") int limit) {

        List<UserDiscoverCard> users = matchingService.getUserRecommendations(
                UUID.fromString(userId),
                limit
        );
        return ResponseEntity.ok(users);
    }

    @PostMapping("/swipe")
    @Operation(summary = "Swipe on a user profile (LIKE or PASS)")
    public ResponseEntity<Void> swipe(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody SwipeRequest req) {
        matchingService.swipe(UUID.fromString(userId), req.targetUserId(), req.action());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/matches")
    @Operation(summary = "Get all matched users for the current user")
    public ResponseEntity<List<UserDiscoverCard>> getMatches(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(matchingService.getMatches(UUID.fromString(userId)));
    }
}
