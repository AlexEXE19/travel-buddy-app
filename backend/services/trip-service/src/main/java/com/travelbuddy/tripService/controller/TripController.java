package com.travelbuddy.tripservice.controller;

import com.travelbuddy.tripservice.dto.CreateTripRequest;
import com.travelbuddy.tripservice.dto.UpdateTripStatusRequest;
import com.travelbuddy.tripservice.entity.Trip;
import com.travelbuddy.tripservice.enums.TripFilter;
import com.travelbuddy.tripservice.enums.TripStatus;
import com.travelbuddy.tripservice.service.TripService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @GetMapping("/me/created")
    public ResponseEntity<List<Trip>> getUserTrips(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(tripService.getUserTrips(userId));
    }

    @GetMapping("/me/joined")
    public ResponseEntity<List<Trip>> getUserJoinedTrips(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(tripService.getUserJoinedTrips(userId));
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<Trip> getTrip(
            @PathVariable UUID tripId) {
        return ResponseEntity.ok(tripService.getTripById(tripId));
    }

    @PostMapping("/create")
    public ResponseEntity<Trip> createTrip(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody CreateTripRequest dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tripService.createTrip(userId, dto));
    }

    @PatchMapping("/{tripId}/status")
    public ResponseEntity<String> updateStatus(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID tripId,
            @Valid @RequestBody UpdateTripStatusRequest dto) {
        tripService.updateStatus(userId, tripId, dto);
        return ResponseEntity.ok("Status updated successfully!");
    }

    @PostMapping("/{tripId}/join")
    public ResponseEntity<String> joinTrip(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID tripId) {
        tripService.joinTrip(userId, tripId);
        return ResponseEntity.ok("Joined trip successfully!");
    }

    @DeleteMapping("/{tripId}/leave")
    public ResponseEntity<String> leaveTrip(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID tripId) {
        tripService.leaveTrip(userId, tripId);
        return ResponseEntity.ok("Left trip successfully!");
    }
}