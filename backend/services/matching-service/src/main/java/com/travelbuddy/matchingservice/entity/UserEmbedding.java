package com.travelbuddy.matchingservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "user_embeddings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEmbedding {

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "embedding", columnDefinition = "vector(384)", nullable = false)
    private float[] embedding;
}
