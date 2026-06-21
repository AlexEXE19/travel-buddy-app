package com.travelbuddy.tripservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
@Entity
@Table(name = "itineraries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Itinerary {

    @Id
    private UUID id;

    @OneToOne
    @JoinColumn(name = "trip_id", nullable = false)
    @JsonBackReference
    private Trip trip;

    // REQUIRED start of journey
    @Column(name = "start_time", nullable = false)
    private Instant startDateTime;

    @Column(name = "start_name", nullable = false)
    private String startLocationName;

    @Column(name = "start_lat", nullable = false)
    private Double startLat;

    @Column(name = "start_lng", nullable = false)
    private Double startLng;

    // Optional end of journey
    @Column(name = "end_time")
    private Instant endDateTime;

    @OneToMany(
            mappedBy = "itinerary",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @OrderBy("orderIndex ASC")
    @JsonManagedReference
    @Builder.Default
    private List<ItineraryStop> stops = new ArrayList<>();
}