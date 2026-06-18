package com.travelbuddy.matchingservice.events;

import com.travelbuddy.matchingservice.client.EmbeddingClient;
import com.travelbuddy.matchingservice.client.ProfileClient;
import com.travelbuddy.matchingservice.config.RabbitConfig;
import com.travelbuddy.matchingservice.dto.EmbeddingRequest;
import com.travelbuddy.matchingservice.dto.ProfileResponse;
import com.travelbuddy.matchingservice.entity.TripEmbedding;
import com.travelbuddy.matchingservice.repository.TripEmbeddingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TripEventListener {

    private final EmbeddingClient embeddingClient;
    private final ProfileClient profileClient;
    private final TripEmbeddingRepository tripEmbeddingRepository;

    @RabbitListener(queues = RabbitConfig.TRIP_QUEUE)
    public void handleTripCreated(TripCreatedEvent event) {
        try {
            ProfileResponse profile = profileClient.getProfile(
                event.creatorId().toString()
            );

            String text = buildTripText(event, profile);

            List<Float> vector = embeddingClient.embed(
                new EmbeddingRequest(text)
            ).embedding();

            TripEmbedding tripEmbedding = tripEmbeddingRepository
                .findByTripId(event.tripId())
                .orElse(new TripEmbedding());

            tripEmbedding.setTripId(event.tripId());
            tripEmbedding.setEmbedding(vector);

            tripEmbeddingRepository.save(tripEmbedding);

            log.info("Stored embedding for trip {}", event.tripId());

        } catch (Exception e) {
            log.error("Failed to process trip embedding for tripId {}: {}",
                event.tripId(), e.getMessage());
        }
    }

    private String buildTripText(TripCreatedEvent event, ProfileResponse profile) {
        StringBuilder sb = new StringBuilder();

        if (event.type() != null)
            sb.append("Trip type: ").append(event.type()).append(". ");

        if (event.estimatedBudget() != null)
            sb.append("Estimated budget: ").append(event.estimatedBudget()).append(". ");

        if (profile.travelStyle() != null)
            sb.append("Travel style: ").append(profile.travelStyle()).append(". ");

        if (profile.budget() != null)
            sb.append("Budget: ").append(profile.budget()).append(". ");

        if (profile.preferredClimate() != null)
            sb.append("Preferred climate: ").append(profile.preferredClimate()).append(". ");

        if (profile.interests() != null && !profile.interests().isEmpty())
            sb.append("Interests: ")
              .append(String.join(", ", profile.interests()))
              .append(". ");

        return sb.toString().trim();
    }
}