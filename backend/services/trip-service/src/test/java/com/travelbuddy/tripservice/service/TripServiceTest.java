package com.travelbuddy.tripservice.service;

import com.travelbuddy.tripservice.client.ProfileClient;
import com.travelbuddy.tripservice.repository.ItineraryRepository;
import com.travelbuddy.tripservice.repository.TripRepository;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/** Unit tests for the weekly trip-creation rate limit using mocked collaborators. */
class TripServiceTest {

    private final TripRepository tripRepo = mock(TripRepository.class);
    private final ItineraryRepository itineraryRepo = mock(ItineraryRepository.class);
    private final TripProducer producer = mock(TripProducer.class);
    private final ProfileClient profileClient = mock(ProfileClient.class);
    private final TripService service = new TripService(tripRepo, itineraryRepo, producer, profileClient);

    @Test
    void nonPremiumUserOverWeeklyLimitIsRejectedWith429() {
        // No profile returned -> treated as non-premium.
        when(profileClient.getBatch(any())).thenReturn(List.of());
        when(tripRepo.countByCreatorIdAndCreatedAtAfter(any(UUID.class), any())).thenReturn(99L);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.createTrip(UUID.randomUUID().toString(), null));

        assertEquals(HttpStatus.TOO_MANY_REQUESTS, ex.getStatusCode());
        verify(tripRepo, never()).save(any());
    }
}
