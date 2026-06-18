package com.travelbuddy.matchingservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "trip_embeddings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripEmbedding {

    @Id
    @Column(name = "trip_id")
    private UUID tripId; 

    @Column(name = "creator_id", nullable = false)
    private UUID creatorId; 

    @Column(name = "embedding", columnDefinition = "vector(384)", nullable = false)
    private float[] embedding; 
}