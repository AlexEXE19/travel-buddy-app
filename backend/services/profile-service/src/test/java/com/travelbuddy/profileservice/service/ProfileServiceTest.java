package com.travelbuddy.profileservice.service;

import com.travelbuddy.profileservice.entity.UserProfile;
import com.travelbuddy.profileservice.enums.Gender;
import com.travelbuddy.profileservice.repository.UserProfileRepository;
import org.junit.jupiter.api.Test;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/** Unit tests for discover-filter eligibility rules using a mocked repository. */
class ProfileServiceTest {

    private final UserProfileRepository repo = mock(UserProfileRepository.class);
    private final AmqpTemplate amqp = mock(AmqpTemplate.class);
    private final ProfileService service = new ProfileService(repo, amqp);

    private UserProfile profile(Gender gender, boolean verified) {
        UserProfile p = new UserProfile();
        p.setGender(gender);
        p.setVerified(verified);
        return p;
    }

    @Test
    void femaleOnlyFilterForbiddenForNonFemaleUser() {
        String id = UUID.randomUUID().toString();
        when(repo.findById(any(UUID.class))).thenReturn(Optional.of(profile(Gender.MALE, true)));
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.updatePreferences(id, true, false));
        assertEquals(403, ex.getStatusCode().value());
        verify(repo, never()).save(any());
    }

    @Test
    void verifiedOnlyFilterForbiddenForUnverifiedUser() {
        String id = UUID.randomUUID().toString();
        when(repo.findById(any(UUID.class))).thenReturn(Optional.of(profile(Gender.FEMALE, false)));
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.updatePreferences(id, false, true));
        assertEquals(403, ex.getStatusCode().value());
        verify(repo, never()).save(any());
    }

    @Test
    void eligibleUserSavesPreferences() {
        String id = UUID.randomUUID().toString();
        when(repo.findById(any(UUID.class))).thenReturn(Optional.of(profile(Gender.FEMALE, true)));
        Map<String, Boolean> result = service.updatePreferences(id, true, true);
        assertEquals(Boolean.TRUE, result.get("femaleOnly"));
        assertEquals(Boolean.TRUE, result.get("verifiedOnly"));
        verify(repo).save(any(UserProfile.class));
    }
}
