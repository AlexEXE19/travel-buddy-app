package com.travelbuddy.matchingservice.repository;

import com.travelbuddy.matchingservice.entity.SwipeEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.UUID;

@Repository
public interface SwipeEventRepository extends JpaRepository<SwipeEvent, UUID> {
    long countByUserIdAndCreatedAtAfter(UUID userId, Instant after);
}
