package com.travelbuddy.tripservice.service;

import com.travelbuddy.tripservice.dto.CreateTripRequest;
import com.travelbuddy.tripservice.dto.CreateItineraryRequest;


import com.travelbuddy.tripservice.dto.UpdateTripStatusRequest;
import com.travelbuddy.tripservice.entity.Itinerary;
import com.travelbuddy.tripservice.entity.Trip;
import com.travelbuddy.tripservice.entity.ItineraryStop;

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

    public List<Trip> getUserTrips(String userId) {
        UUID userUUID = UUID.fromString(userId);
            return tripRepository.findByCreatorId(userUUID);
        };


public List<Trip> getUserJoinedTrips(String userId) {
    UUID userUUID = UUID.fromString(userId);
    return tripRepository.findByMemberId(userUUID);
};



    public Trip getTripById(UUID tripId) {
        return tripRepository.findById(tripId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));
    }

    public Trip createTrip(String userId, CreateTripRequest dto) {
        UUID tripId = UUID.randomUUID();

        Trip trip = Trip.builder()
                .id(tripId)
                .title(dto.title())
                .description(dto.description())
                .creatorId(UUID.fromString(userId))
                .tripType(dto.tripType())
                .maxCapacity(dto.maxCapacity())
                .status(TripStatus.OPEN)
                .build();

        trip = tripRepository.save(trip);

        if (dto.itinerary() != null) {
            CreateItineraryRequest iDto = dto.itinerary();

            Itinerary itinerary = Itinerary.builder()
                    .id(UUID.randomUUID())
                    .trip(trip)
                    .startDateTime(iDto.startDateTime())
                    .startLocationName(iDto.startLocationName())
                    .startLat(iDto.startLat())
                    .startLng(iDto.startLng())
                    .endDateTime(iDto.endDateTime())
                    .build();

            if (iDto.stops() != null) {
                List<ItineraryStop> stops = iDto.stops().stream()
                        .map(s -> ItineraryStop.builder()
                                .id(UUID.randomUUID())
                                .itinerary(itinerary)
                                .name(s.name())
                                .latitude(s.latitude())
                                .longitude(s.longitude())
                                .orderIndex(s.orderIndex())
                                .arrivalDateTime(s.arrivalDateTime())
                                .departureDateTime(s.departureDateTime())
                                .build())
                        .toList();
                itinerary.setStops(stops);
            }

            itineraryRepository.save(itinerary);
        }

        tripProducer.sendTripCreatedEvent(new TripCreatedEvent(
                trip.getId(),
                trip.getCreatorId(),
                trip.getTripType()
        ));

        return trip;
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