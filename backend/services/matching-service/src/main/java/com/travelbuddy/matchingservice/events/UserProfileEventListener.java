package com.travelbuddy.matchingservice.events;

import com.travelbuddy.matchingservice.client.EmbeddingClient;
import com.travelbuddy.matchingservice.client.ProfileClient;
import com.travelbuddy.matchingservice.config.RabbitConfig;
import com.travelbuddy.matchingservice.dto.EmbeddingRequest;
import com.travelbuddy.matchingservice.dto.ProfileMatchingData;
import com.travelbuddy.matchingservice.entity.UserEmbedding;
import com.travelbuddy.matchingservice.repository.UserEmbeddingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserProfileEventListener {

    private final EmbeddingClient embeddingClient;
    private final ProfileClient profileClient;
    private final UserEmbeddingRepository userEmbeddingRepository;

    @RabbitListener(queues = RabbitConfig.PROFILE_UPDATED_QUEUE)
    public void handleProfileUpdated(UserProfileUpdatedEvent event) {
        try {
            ProfileMatchingData profile = profileClient.getProfileForMatching(event.userId().toString());
            String text = profile.toEmbeddingText();

            List<Float> vectorList = embeddingClient.embed(new EmbeddingRequest(text)).embedding();
            float[] vector = new float[vectorList.size()];
            for (int i = 0; i < vectorList.size(); i++) {
                vector[i] = vectorList.get(i);
            }

            UserEmbedding embedding = userEmbeddingRepository
                    .findByUserId(event.userId())
                    .orElse(new UserEmbedding());
            embedding.setUserId(event.userId());
            embedding.setEmbedding(vector);
            userEmbeddingRepository.save(embedding);

            log.info("Stored/updated embedding for user {}", event.userId());
        } catch (Exception e) {
            log.error("Failed to process user embedding for userId {}: {}", event.userId(), e.getMessage());
        }
    }
}
