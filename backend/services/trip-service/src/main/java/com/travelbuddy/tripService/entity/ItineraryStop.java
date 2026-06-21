package com.travelbuddy.tripservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "itinerary_stops")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItineraryStop {

    @Id
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "itinerary_id", nullable = false)
    @JsonBackReference
    private Itinerary itinerary;

    @Column(name = "order_index", nullable = false)
    private int orderIndex;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    // Optional timing (real travel apps do this)
    @Column(name = "arrival_time")
    private Instant arrivalDateTime;

    @Column(name = "departure_time")
    private Instant departureDateTime;
}