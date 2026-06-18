package com.travelbuddy.tripservice.service;

import com.travelbuddy.tripservice.dto.CreateTripRequest;
import com.travelbuddy.tripservice.dto.UpdateTripStatusRequest;
import com.travelbuddy.tripservice.entity.Itinerary;
import com.travelbuddy.tripservice.entity.Trip;
import com.travelbuddy.tripservice.enums.TripFilter;
import com.travelbuddy.tripservice.enums.TripStatus;
import com.travelbuddy.tripservice.repository.ItineraryRepository;
import com.travelbuddy.tripservice.repository.TripRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.travelbuddy.tripservice.events.TripCreatedEvent;
import com.travelbuddy.tripservice.service.TripProducer;

import java.util.List;
import java.util.UUID;

@Service
public class TripService {

    private final TripRepository tripRepository;
    private final ItineraryRepository itineraryRepository;
    private final TripProducer tripProducer;

    public TripService(TripRepository tripRepository,
                       ItineraryRepository itineraryRepository,TripProducer tripProducer) {
        this.tripRepository = tripRepository;
        this.itineraryRepository = itineraryRepository;
            this.tripProducer = tripProducer; 
    }

    public List<Trip> getTrips(String userId, TripStatus status, TripFilter filter) {
        UUID userUUID = UUID.fromString(userId);

        return switch (filter) {
            case MY_TRIPS -> status != null
                    ? tripRepository.findByCreatorIdAndStatus(userUUID, status)
                    : tripRepository.findByCreatorId(userUUID);

            case JOINED_TRIPS -> status != null
                    ? tripRepository.findByMemberIdAndStatus(userUUID, status)
                    : tripRepository.findByMemberId(userUUID);

            case ALL -> status != null
                    ? tripRepository.findByStatus(status)
                    : tripRepository.findByStatus(TripStatus.OPEN);
        };
    }

    public Trip getTripById(UUID tripId) {
        return tripRepository.findById(tripId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));
    }

    public Trip createTrip(String userId, CreateTripRequest dto) {
        UUID userUUID = UUID.fromString(userId);

        Itinerary itinerary = null;
        if (dto.itineraryId() != null) {
            itinerary = itineraryRepository.findById(dto.itineraryId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Itinerary not found"));

            if (!itinerary.getCreatorId().equals(userUUID)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your itinerary");
            }
        }
Trip trip = Trip.builder()
        .id(UUID.randomUUID())
        .title(dto.title())
        .description(dto.description())
        .creatorId(userUUID)
        .type(dto.type())
        .startDate(dto.startDate())
        .itinerary(itinerary)
        .maxCapacity(dto.maxCapacity())
        .status(TripStatus.OPEN)
        .build();

        Trip savedTrip = tripRepository.save(trip);

        Float budget = trip.getItinerary() != null
                ? trip.getItinerary().getEstimatedBudget()
                : null;

        tripProducer.sendTripCreatedEvent(new TripCreatedEvent(
                trip.getId(),
                trip.getCreatorId(),
                trip.getType(),
                budget
        ));

        return savedTrip;
    }

    public void updateStatus(String userId, UUID tripId, UpdateTripStatusRequest dto) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));

        if (!trip.getCreatorId().equals(UUID.fromString(userId))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the creator can change trip status");
        }

        if (dto.status() != TripStatus.OPEN && dto.status() != TripStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only OPEN and CANCELLED statuses are allowed");
        }

        trip.setStatus(dto.status());
        tripRepository.save(trip);
    }

    public void joinTrip(String userId, UUID tripId) {
        UUID userUUID = UUID.fromString(userId);

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));

        if (trip.getStatus() != TripStatus.OPEN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Trip is not open for joining");
        }

        if (trip.getMembers().contains(userUUID)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Already a member of this trip");
        }

        if (trip.getMembers().size() >= trip.getMaxCapacity()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Trip is at full capacity");
        }

        trip.getMembers().add(userUUID);

        if (trip.getMembers().size() == trip.getMaxCapacity()) {
            trip.setStatus(TripStatus.FILLED);
        }

        tripRepository.save(trip);
    }

    public void leaveTrip(String userId, UUID tripId) {
        UUID userUUID = UUID.fromString(userId);

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));

        if (trip.getCreatorId().equals(userUUID)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Creator cannot leave — cancel the trip instead");
        }

        if (!trip.getMembers().contains(userUUID)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not a member of this trip");
        }

        trip.getMembers().remove(userUUID);

        if (trip.getStatus() == TripStatus.FILLED) {
            trip.setStatus(TripStatus.OPEN);
        }

        tripRepository.save(trip);
    }
}