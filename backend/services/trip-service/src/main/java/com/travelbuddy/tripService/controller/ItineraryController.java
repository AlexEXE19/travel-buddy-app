package com.travelbuddy.tripservice.controller;

import com.travelbuddy.tripservice.dto.CreateItineraryRequest;
import com.travelbuddy.tripservice.dto.UpdateItineraryRequest;
import com.travelbuddy.tripservice.entity.Itinerary;
import com.travelbuddy.tripservice.service.ItineraryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/trips/itineraries")
public class ItineraryController {

    private final ItineraryService itineraryService;

    public ItineraryController(ItineraryService itineraryService) {
        this.itineraryService = itineraryService;
    }

    @GetMapping
    public ResponseEntity<List<Itinerary>> getMyItineraries(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(itineraryService.getByCreatorId(userId));
    }

    @GetMapping("/{itineraryId}")
    public ResponseEntity<Itinerary> getItinerary(
            @PathVariable UUID itineraryId) {
        return ResponseEntity.ok(itineraryService.getById(itineraryId));
    }

    @PostMapping
    public ResponseEntity<Itinerary> createItinerary(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody CreateItineraryRequest dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(itineraryService.create(userId, dto));
    }

    @PutMapping("/{itineraryId}")
    public ResponseEntity<Itinerary> updateItinerary(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID itineraryId,
            @Valid @RequestBody UpdateItineraryRequest dto) {
        return ResponseEntity.ok(itineraryService.update(userId, itineraryId, dto));
    }

    @DeleteMapping("/{itineraryId}")
    public ResponseEntity<String> deleteItinerary(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID itineraryId) {
        itineraryService.delete(userId, itineraryId);
        return ResponseEntity.ok("Itinerary deleted successfully!");
    }
}