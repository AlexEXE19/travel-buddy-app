package com.travelbuddy.matchingservice.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

/** One row per swipe (LIKE or PASS), used to enforce the daily swipe limit. */
@Entity
@Table(name = "swipe_events", indexes = @Index(name = "idx_swipe_user_time", columnList = "user_id,created_at"))
@Getter
@Setter
@NoArgsConstructor
public class SwipeEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    public SwipeEvent(UUID userId, Instant createdAt) {
        this.userId = userId;
        this.createdAt = createdAt;
    }
}
