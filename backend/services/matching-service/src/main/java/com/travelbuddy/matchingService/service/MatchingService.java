package com.travelbuddy.matchingservice.service;

import com.travelbuddy.matchingservice.repository.TripEmbeddingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MatchingService {

    private final TripEmbeddingRepository tripEmbeddingRepository;

    public List<UUID> getRealTimeRecommendations(UUID userId, int limit) {
        float[] userVector = getUserVectorFromDb(userId); // Mock method for example

        return tripEmbeddingRepository.findClosestTrips(userVector, userId, limit);
    }

    private float[] getUserVectorFromDb(UUID userId) {
        return new float[384]; 
    }
}