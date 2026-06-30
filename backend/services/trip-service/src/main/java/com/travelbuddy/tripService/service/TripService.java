package com.travelbuddy.tripservice.service;

import com.travelbuddy.tripservice.dto.CreateTripRequest;
import com.travelbuddy.tripservice.dto.CreateItineraryRequest;


import com.travelbuddy.tripservice.dto.UpdateTripStatusRequest;
import com.travelbuddy.tripservice.entity.Itinerary;
import com.travelbuddy.tripservice.entity.Trip;
import com.travelbuddy.tripservice.entity.ItineraryStop;

import com.travelbuddy.tripservice.enums.TripStatus;
import com.travelbuddy.tripservice.repository.ItineraryRepository;
import com.travelbuddy.tripservice.repository.TripRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.travelbuddy.tripservice.events.TripCreatedEvent;
import com.travelbuddy.tripservice.events.UserJoinedTripEvent;
import com.travelbuddy.tripservice.service.TripProducer;
import com.travelbuddy.tripservice.client.ProfileClient;
import com.travelbuddy.tripservice.client.ProfileSummary;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TripService {

    private static final int WEEKLY_TRIP_LIMIT = 2;

    private final TripRepository tripRepository;
    private final ItineraryRepository itineraryRepository;
    private final TripProducer tripProducer;
    private final ProfileClient profileClient;

    public TripService(TripRepository tripRepository,
                       ItineraryRepository itineraryRepository, TripProducer tripProducer,
                       ProfileClient profileClient) {
        this.tripRepository = tripRepository;
        this.itineraryRepository = itineraryRepository;
        this.tripProducer = tripProducer;
        this.profileClient = profileClient;
    }

    /** Look up a single user's profile summary; null if unavailable. */
    private ProfileSummary profileOf(UUID userId) {
        try {
            List<ProfileSummary> list = profileClient.getBatch(List.of(userId));
            return list.isEmpty() ? null : list.get(0);
        } catch (Exception e) {
            return null;
        }
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

    public List<Trip> getBatchTrips(List<UUID> ids) {
        return tripRepository.findAllById(ids);
    }

    public Trip createTrip(String userId, CreateTripRequest dto) {
        UUID creatorId = UUID.fromString(userId);

        // Weekly trip-creation limit for non-premium users.
        ProfileSummary creator = profileOf(creatorId);
        boolean premium = creator != null && creator.isPremium();
        if (!premium) {
            long recent = tripRepository.countByCreatorIdAndCreatedAtAfter(creatorId, LocalDateTime.now().minusDays(7));
            if (recent >= WEEKLY_TRIP_LIMIT) {
                throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                        "Weekly trip limit reached (" + WEEKLY_TRIP_LIMIT
                                + "/week). Upgrade to Premium for unlimited trips.");
            }
        }

        UUID tripId = UUID.randomUUID();

        Trip trip = Trip.builder()
                .id(tripId)
                .title(dto.title())
                .description(dto.description())
                .creatorId(creatorId)
                .tripType(dto.tripType())
                .maxCapacity(dto.maxCapacity())
                .womenOnly(dto.womenOnly())
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
                trip.getTripType().name(),
                trip.getDescription(),
                trip.getTitle()
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

        // Women-only trips can only be joined by women travelers.
        if (trip.isWomenOnly()) {
            ProfileSummary joiner = profileOf(userUUID);
            if (joiner == null || !joiner.isFemale()) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "This trip is open to women travelers only.");
            }
        }

        trip.getMembers().add(userUUID);

        if (trip.getMembers().size() == trip.getMaxCapacity()) {
            trip.setStatus(TripStatus.FILLED);
        }

        tripRepository.save(trip);

        tripProducer.sendUserJoinedTripEvent(new UserJoinedTripEvent(
                tripId, UUID.fromString(userId), trip.getTitle()
        ));
    }

    public List<Trip> getOpenTrips() {
        return tripRepository.findByStatus(TripStatus.OPEN);
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