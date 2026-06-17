package com.travelbuddy.profileservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "travel_preferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TravelPreference {

    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne
    @JoinColumn(name = "profile_id")
    private UserProfile profile;

    private String travelStyle;

    private String preferredClimate;

    private String preferredTransport;

    private String preferredAccommodation;
}