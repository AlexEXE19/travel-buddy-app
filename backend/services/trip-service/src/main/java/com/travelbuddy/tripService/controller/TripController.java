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

    @GetMapping
    public ResponseEntity<List<Trip>> getTrips(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(required = false) TripStatus status,
            @RequestParam(defaultValue = "ALL") TripFilter filter) {
        return ResponseEntity.ok(tripService.getTrips(userId, status, filter));
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<Trip> getTrip(
            @PathVariable UUID tripId) {
        return ResponseEntity.ok(tripService.getTripById(tripId));
    }

    @PostMapping
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