package com.travelbuddy.tripservice.service;

import com.travelbuddy.tripservice.dto.CreateItineraryRequest;
import com.travelbuddy.tripservice.dto.UpdateItineraryRequest;
import com.travelbuddy.tripservice.entity.Itinerary;
import com.travelbuddy.tripservice.repository.ItineraryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class ItineraryService {

    private final ItineraryRepository itineraryRepository;

    public ItineraryService(ItineraryRepository itineraryRepository) {
        this.itineraryRepository = itineraryRepository;
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
                .startDate(dto.startDate())
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
        if (dto.startDate() != null) itinerary.setStartDate(dto.startDate());
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

        itineraryRepository.deleteById(itineraryId);
    }
}