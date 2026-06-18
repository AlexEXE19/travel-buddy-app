package com.travelbuddy.matchingservice.repository;

import com.travelbuddy.matchingservice.entity.TripEmbedding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

public interface TripEmbeddingRepository extends JpaRepository<TripEmbedding, UUID> {
    Optional<TripEmbedding> findByTripId(UUID tripId);

    @Query(value = "SELECT t.trip_id FROM trip_embeddings t " +
                   "WHERE t.creator_id != :userId " +
                   "ORDER BY t.embedding <=> cast(:userVector as vector) " +
                   "LIMIT :limit", nativeQuery = true)
    List<UUID> findClosestTrips(@Param("userVector") float[] userVector, 
                                @Param("userId") UUID userId, 
                                @Param("limit") int limit);
}