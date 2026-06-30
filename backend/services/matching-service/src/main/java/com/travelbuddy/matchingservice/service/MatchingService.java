package com.travelbuddy.matchingservice.service;

import com.travelbuddy.matchingservice.client.EmbeddingClient;
import com.travelbuddy.matchingservice.client.ProfileClient;
import com.travelbuddy.matchingservice.client.TripClient;
import com.travelbuddy.matchingservice.config.RabbitConfig;
import com.travelbuddy.matchingservice.dto.DiscoverTrip;
import com.travelbuddy.matchingservice.dto.EmbeddingRequest;
import com.travelbuddy.matchingservice.dto.ProfileMatchingData;
import com.travelbuddy.matchingservice.dto.TripSummaryResponse;
import com.travelbuddy.matchingservice.dto.UserDiscoverCard;
import com.travelbuddy.matchingservice.dto.UserProfileSummary;
import com.travelbuddy.matchingservice.entity.Connection;
import com.travelbuddy.matchingservice.entity.ConnectionStatus;
import com.travelbuddy.matchingservice.entity.SwipeEvent;
import com.travelbuddy.matchingservice.events.UserMatchedEvent;
import com.travelbuddy.matchingservice.repository.ConnectionRepository;
import com.travelbuddy.matchingservice.repository.SwipeEventRepository;
import com.travelbuddy.matchingservice.repository.TripEmbeddingRepository;
import com.travelbuddy.matchingservice.repository.UserEmbeddingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatchingService {

    private final TripEmbeddingRepository tripEmbeddingRepository;
    private final UserEmbeddingRepository userEmbeddingRepository;
    private final ProfileClient profileClient;
    private final EmbeddingClient embeddingClient;
    private final TripClient tripClient;
    private final ConnectionRepository connectionRepository;
    private final SwipeEventRepository swipeEventRepository;
    private final AmqpTemplate amqpTemplate;

    private static final int DAILY_SWIPE_LIMIT = 5;

    public List<TripSummaryResponse> getRecommendations(UUID userId, int limit) {
        ProfileMatchingData profile = profileClient.getProfileForMatching(userId.toString());
        String userText = profile.toEmbeddingText();

        List<Float> vectorList = embeddingClient.embed(new EmbeddingRequest(userText)).embedding();

        float[] userVector = new float[vectorList.size()];
        for (int i = 0; i < vectorList.size(); i++) {
            userVector[i] = vectorList.get(i);
        }

        List<UUID> recommendedIds = tripEmbeddingRepository.findClosestTrips(userVector, userId, limit);

        if (recommendedIds.isEmpty()) {
            return List.of();
        }

        return tripClient.getBatchTrips(recommendedIds);
    }

    public List<UserDiscoverCard> getUserRecommendations(UUID userId, int limit) {
        ProfileMatchingData profile = profileClient.getProfileForMatching(userId.toString());
        String userText = profile.toEmbeddingText();

        List<Float> vectorList = embeddingClient.embed(new EmbeddingRequest(userText)).embedding();
        float[] userVector = new float[vectorList.size()];
        for (int i = 0; i < vectorList.size(); i++) {
            userVector[i] = vectorList.get(i);
        }

        boolean femaleOnly = profile.filterFemaleOnly() && "FEMALE".equalsIgnoreCase(profile.gender());
        boolean verifiedOnly = profile.filterVerifiedOnly() && profile.verified();

        // Fetch a larger candidate pool when filtering so we can still return ~limit results.
        int pool = (femaleOnly || verifiedOnly) ? Math.max(limit * 4, 50) : limit;
        List<UUID> userIds = userEmbeddingRepository.findClosestUsers(userVector, userId, pool);
        if (userIds.isEmpty()) {
            return List.of();
        }

        Map<UUID, UserProfileSummary> byId = profileClient.getBatchProfiles(userIds).stream()
                .collect(toMap(UserProfileSummary::id, p -> p, (a, b) -> a));

        // Keep nearest-neighbour ranking while applying the filters, then trim to limit.
        List<UserProfileSummary> filtered = new ArrayList<>();
        for (UUID id : userIds) {
            UserProfileSummary p = byId.get(id);
            if (p == null) continue;
            if (femaleOnly && !"FEMALE".equalsIgnoreCase(p.gender())) continue;
            if (verifiedOnly && !Boolean.TRUE.equals(p.verified())) continue;
            filtered.add(p);
            if (filtered.size() >= limit) break;
        }
        return toDiscoverCards(filtered);
    }

    /** Fetches every open trip once and groups them by their creator. */
    private Map<UUID, List<DiscoverTrip>> openTripsByCreator() {
        try {
            return tripClient.getOpenTrips().stream()
                    .filter(t -> t.creatorId() != null)
                    .collect(Collectors.groupingBy(
                            TripSummaryResponse::creatorId,
                            Collectors.mapping(t -> new DiscoverTrip(
                                    t.id(), t.title(), t.tripType(),
                                    t.itinerary() != null ? t.itinerary().startLocationName() : null,
                                    t.itinerary() != null ? t.itinerary().startDateTime() : null
                            ), Collectors.toList())
                    ));
        } catch (Exception e) {
            log.warn("Could not load open trips for discover cards: {}", e.getMessage());
            return Map.of();
        }
    }

    private List<UserDiscoverCard> toDiscoverCards(List<UserProfileSummary> profiles) {
        Map<UUID, List<DiscoverTrip>> tripsByCreator = openTripsByCreator();
        return profiles.stream()
                .map(p -> new UserDiscoverCard(
                        p.id(), p.firstName(), p.lastName(), p.profilePictureUrl(),
                        p.bio(), p.nationality(), p.preferredTravelType(),
                        p.gender(), p.verified(), p.interests(),
                        p.visitedPlaces(), p.bucketListPlaces(),
                        tripsByCreator.getOrDefault(p.id(), List.of())
                ))
                .toList();
    }

    public void swipe(UUID currentUserId, UUID targetUserId, String action) {
        // Daily swipe limit for non-premium users (both LIKE and PASS count).
        ProfileMatchingData me = profileClient.getProfileForMatching(currentUserId.toString());
        if (!me.isPremium()) {
            long recent = swipeEventRepository.countByUserIdAndCreatedAtAfter(
                    currentUserId, Instant.now().minus(Duration.ofHours(24)));
            if (recent >= DAILY_SWIPE_LIMIT) {
                throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                        "Daily swipe limit reached (" + DAILY_SWIPE_LIMIT
                                + "/day). Upgrade to Premium for unlimited swipes.");
            }
        }
        swipeEventRepository.save(new SwipeEvent(currentUserId, Instant.now()));

        if ("PASS".equalsIgnoreCase(action)) {
            return;
        }

        // Check connection from currentUser -> targetUser
        Optional<Connection> forward = connectionRepository.findByUserAIdAndUserBId(currentUserId, targetUserId);
        // Check connection from targetUser -> currentUser
        Optional<Connection> reverse = connectionRepository.findByUserAIdAndUserBId(targetUserId, currentUserId);

        if (reverse.isPresent()) {
            Connection reverseConn = reverse.get();
            if (reverseConn.getStatus() == ConnectionStatus.PENDING) {
                // The other user already liked us — it's a match!
                reverseConn.setStatus(ConnectionStatus.MATCHED);
                connectionRepository.save(reverseConn);
                amqpTemplate.convertAndSend(
                        RabbitConfig.USER_EXCHANGE,
                        RabbitConfig.USER_MATCHED_ROUTING_KEY,
                        new UserMatchedEvent(targetUserId, currentUserId)
                );
                log.info("Match! {} and {}", targetUserId, currentUserId);
                return;
            }
            if (reverseConn.getStatus() == ConnectionStatus.MATCHED) {
                // Already matched, do nothing
                return;
            }
        }

        if (forward.isPresent()) {
            // Already sent a like, do nothing
            return;
        }

        // No connection exists yet — create a PENDING one
        connectionRepository.save(Connection.builder()
                .userAId(currentUserId)
                .userBId(targetUserId)
                .status(ConnectionStatus.PENDING)
                .build());
    }

    public List<UserDiscoverCard> getMatches(UUID userId) {
        List<Connection> matched = connectionRepository.findMatchedConnections(userId);

        List<UUID> otherUserIds = matched.stream()
                .map(c -> c.getUserAId().equals(userId) ? c.getUserBId() : c.getUserAId())
                .toList();

        if (otherUserIds.isEmpty()) {
            return List.of();
        }

        List<UserProfileSummary> profiles = profileClient.getBatchProfiles(otherUserIds);
        return toDiscoverCards(profiles);
    }
}
