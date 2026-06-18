package com.travelbuddy.tripservice.service;

import com.travelbuddy.tripservice.dto.CreateItineraryRequest;
import com.travelbuddy.tripservice.dto.UpdateItineraryRequest;
import com.travelbuddy.tripservice.entity.Itinerary;
import com.travelbuddy.tripservice.repository.ItineraryRepository;
import com.travelbuddy.tripservice.repository.TripRepository;

import com.travelbuddy.tripservice.enums.TripStatus;


import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class ItineraryService {

    private final ItineraryRepository itineraryRepository;
    private final TripRepository tripRepository;


    public ItineraryService(ItineraryRepository itineraryRepository,TripRepository tripRepository) {
        this.itineraryRepository = itineraryRepository;
        this.tripRepository = tripRepository;

    }

    public List<Itinerary> getByCreatorId(String userId) {
        return itineraryRepository.findByCreatorId(UUID.fromString(userId));
    }

    public Itinerary getById(UUID itineraryId) {
        return itineraryRepository.findById(itineraryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Itinerary not found"));
    }

    public Itinerary create(String userId, CreateItineraryRequest dto) {
        Itinerary itinerary = Itinerary.builder()
                .creatorId(UUID.fromString(userId))
                .destination(dto.destination())
                .country(dto.country())
                .duration(dto.duration())
                .estimatedBudget(dto.estimatedBudget())
                .build();

        return itineraryRepository.save(itinerary);
    }

    public Itinerary update(String userId, UUID itineraryId, UpdateItineraryRequest dto) {
        Itinerary itinerary = itineraryRepository.findById(itineraryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Itinerary not found"));

        if (!itinerary.getCreatorId().equals(UUID.fromString(userId))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your itinerary");
        }

        if (dto.destination() != null) itinerary.setDestination(dto.destination());
        if (dto.country() != null) itinerary.setCountry(dto.country());
        if (dto.duration() != null) itinerary.setDuration(dto.duration());
        if (dto.estimatedBudget() != null) itinerary.setEstimatedBudget(dto.estimatedBudget());

        return itineraryRepository.save(itinerary);
    }

   public void delete(String userId, UUID itineraryId) {
    Itinerary itinerary = itineraryRepository.findById(itineraryId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Itinerary not found"));

    if (!itinerary.getCreatorId().equals(UUID.fromString(userId))) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your itinerary");
    }

    tripRepository.findByItineraryId(itineraryId).ifPresent(trip -> {
        if (trip.getStatus() == TripStatus.OPEN || trip.getStatus() == TripStatus.FILLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot delete itinerary attached to an active trip");
        }
    });

    itineraryRepository.deleteById(itineraryId);
}
}