package com.travelbuddy.matchingservice.events;

import com.travelbuddy.matchingservice.client.EmbeddingClient;
import com.travelbuddy.matchingservice.client.ProfileClient;
import com.travelbuddy.matchingservice.config.RabbitConfig;
import com.travelbuddy.matchingservice.dto.EmbeddingRequest;
import com.travelbuddy.matchingservice.dto.ProfileMatchingData;
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

    @RabbitListener(queues = RabbitConfig.QUEUE)
    public void handleTripCreated(TripCreatedEvent event) {
        try {
            ProfileMatchingData profile = profileClient.getProfileForMatching(
                    event.creatorId().toString()
            );

            String text = buildEmbeddingText(event, profile);

            List<Float> vectorList = embeddingClient.embed(
                    new EmbeddingRequest(text)
            ).embedding();

            float[] vectorArray = new float[vectorList.size()];
            for (int i = 0; i < vectorList.size(); i++) {
                vectorArray[i] = vectorList.get(i);
            }

            TripEmbedding tripEmbedding = tripEmbeddingRepository
                    .findByTripId(event.tripId())
                    .orElse(new TripEmbedding());

            tripEmbedding.setTripId(event.tripId());
            tripEmbedding.setCreatorId(event.creatorId());
            tripEmbedding.setEmbedding(vectorArray);

            tripEmbeddingRepository.save(tripEmbedding);

            log.info("Stored embedding for trip {}", event.tripId());

        } catch (Exception e) {
            log.error("Failed to process trip embedding for tripId {}: {}",
                    event.tripId(), e.getMessage());
        }
    }

    private String buildEmbeddingText(TripCreatedEvent event, ProfileMatchingData profile) {
        StringBuilder sb = new StringBuilder();

        if (event.tripType() != null)
            sb.append("Trip type: ").append(event.tripType().replace("_", " ").toLowerCase()).append(". ");
        if (event.description() != null && !event.description().isBlank())
            sb.append("Description: ").append(event.description()).append(". ");

        sb.append(profile.toEmbeddingText());

        return sb.toString().trim();
    }
}
