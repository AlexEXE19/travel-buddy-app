package com.travelbuddy.matchingservice.service;

import com.travelbuddy.matchingservice.client.EmbeddingClient;
import com.travelbuddy.matchingservice.client.ProfileClient;
import com.travelbuddy.matchingservice.client.TripClient;
import com.travelbuddy.matchingservice.dto.ProfileMatchingData;
import com.travelbuddy.matchingservice.repository.ConnectionRepository;
import com.travelbuddy.matchingservice.repository.SwipeEventRepository;
import com.travelbuddy.matchingservice.repository.TripEmbeddingRepository;
import com.travelbuddy.matchingservice.repository.UserEmbeddingRepository;
import org.junit.jupiter.api.Test;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/** Unit tests for the daily swipe rate limit using mocked collaborators. */
class MatchingServiceTest {

    private final TripEmbeddingRepository tripEmbeddingRepo = mock(TripEmbeddingRepository.class);
    private final UserEmbeddingRepository userEmbeddingRepo = mock(UserEmbeddingRepository.class);
    private final ProfileClient profileClient = mock(ProfileClient.class);
    private final EmbeddingClient embeddingClient = mock(EmbeddingClient.class);
    private final TripClient tripClient = mock(TripClient.class);
    private final ConnectionRepository connectionRepo = mock(ConnectionRepository.class);
    private final SwipeEventRepository swipeEventRepo = mock(SwipeEventRepository.class);
    private final AmqpTemplate amqp = mock(AmqpTemplate.class);

    private final MatchingService service = new MatchingService(
            tripEmbeddingRepo, userEmbeddingRepo, profileClient, embeddingClient,
            tripClient, connectionRepo, swipeEventRepo, amqp);

    private ProfileMatchingData freeUser() {
        return new ProfileMatchingData(null, null, null, null, null, null,
                null, false, "FREE", false, false);
    }

    @Test
    void nonPremiumUserOverDailyLimitIsRejectedWith429() {
        when(profileClient.getProfileForMatching(anyString())).thenReturn(freeUser());
        when(swipeEventRepo.countByUserIdAndCreatedAtAfter(any(UUID.class), any(Instant.class)))
                .thenReturn(99L);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.swipe(UUID.randomUUID(), UUID.randomUUID(), "LIKE"));

        assertEquals(HttpStatus.TOO_MANY_REQUESTS, ex.getStatusCode());
        verify(swipeEventRepo, never()).save(any());
    }
}
