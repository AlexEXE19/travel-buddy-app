package com.travelbuddy.matchingservice.repository;

import com.travelbuddy.matchingservice.entity.UserEmbedding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserEmbeddingRepository extends JpaRepository<UserEmbedding, UUID> {

    Optional<UserEmbedding> findByUserId(UUID userId);

    @Query(value = "SELECT ue.user_id FROM user_embeddings ue " +
                   "WHERE ue.user_id != :currentUserId " +
                   "ORDER BY ue.embedding <=> cast(:queryVector as vector) " +
                   "LIMIT :limit", nativeQuery = true)
    List<UUID> findClosestUsers(@Param("queryVector") float[] queryVector,
                                @Param("currentUserId") UUID currentUserId,
                                @Param("limit") int limit);
}
