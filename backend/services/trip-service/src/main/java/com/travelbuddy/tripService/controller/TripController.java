package com.travelbuddy.tripservice.controller;

import com.travelbuddy.tripservice.dto.CreateTripRequest;
import com.travelbuddy.tripservice.dto.UpdateTripStatusRequest;
import com.travelbuddy.tripservice.entity.Trip;
import com.travelbuddy.tripservice.service.TripService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/trips")
@Tag(name = "Trips", description = "Trip creation, discovery, and membership management")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @GetMapping("/me/created")
    @Operation(summary = "Get all trips created by the current user")
    public ResponseEntity<List<Trip>> getUserCreatedTrips(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(tripService.getUserTrips(userId));
    }

    @GetMapping("/me/joined")
    @Operation(summary = "Get all trips the current user has joined")
    public ResponseEntity<List<Trip>> getUserJoinedTrips(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(tripService.getUserJoinedTrips(userId));
    }

    @GetMapping("/{tripId}")
    @Operation(summary = "Get a trip by its ID")
    public ResponseEntity<Trip> getTrip(
            @PathVariable UUID tripId) {
        return ResponseEntity.ok(tripService.getTripById(tripId));
    }

    @PostMapping("/create")
    @Operation(summary = "Create a new trip with an itinerary")
    public ResponseEntity<Trip> createTrip(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody CreateTripRequest dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tripService.createTrip(userId, dto));
    }

    @PatchMapping("/{tripId}/status")
    @Operation(summary = "Update trip status (OPEN or CANCELLED)")
    public ResponseEntity<String> updateStatus(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID tripId,
            @Valid @RequestBody UpdateTripStatusRequest dto) {
        tripService.updateStatus(userId, tripId, dto);
        return ResponseEntity.ok("Status updated successfully!");
    }

    @PostMapping("/{tripId}/join")
    @Operation(summary = "Join a trip")
    public ResponseEntity<String> joinTrip(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID tripId) {
        tripService.joinTrip(userId, tripId);
        return ResponseEntity.ok("Joined trip successfully!");
    }

    @GetMapping("/open")
    @Operation(summary = "Get all open trips (for map discovery)")
    public ResponseEntity<List<Trip>> getOpenTrips() {
        return ResponseEntity.ok(tripService.getOpenTrips());
    }

    @PostMapping("/batch")
    @Operation(summary = "Fetch multiple trips by ID list (used by matching service)")
    public ResponseEntity<List<Trip>> getBatchTrips(@RequestBody List<UUID> ids) {
        return ResponseEntity.ok(tripService.getBatchTrips(ids));
    }

    @DeleteMapping("/{tripId}/leave")
    @Operation(summary = "Leave a trip")
    public ResponseEntity<String> leaveTrip(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID tripId) {
        tripService.leaveTrip(userId, tripId);
        return ResponseEntity.ok("Left trip successfully!");
    }
}
