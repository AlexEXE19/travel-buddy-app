package com.travelbuddy.tripservice.repository;

import com.travelbuddy.tripservice.entity.Itinerary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ItineraryRepository extends JpaRepository<Itinerary, UUID> {
    List<Itinerary> findByTripCreatorId(UUID creatorId);
}