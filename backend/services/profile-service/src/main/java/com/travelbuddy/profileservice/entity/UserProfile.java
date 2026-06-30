package com.travelbuddy.profileservice.entity;

import com.travelbuddy.profileservice.enums.*;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    private String phone;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private String nationality;

    @Column(name = "country_of_residence")
    private String countryOfResidence;

    @Column(name = "city_of_residence")
    private String cityOfResidence;

    @Column(name = "preferred_language")
    private String preferredLanguage;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(length = 1000)
    private String bio;

    @Column(name = "profile_picture_url")
    private String profilePictureUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "budget_range")
    private BudgetRange budgetRange;

    @Enumerated(EnumType.STRING)
    @Column(name = "preferred_travel_type")
    private PreferredTravelType preferredTravelType;

    @Enumerated(EnumType.STRING)
    @Column(name = "preferred_climate")
    private PreferredClimate preferredClimate;

    @Enumerated(EnumType.STRING)
    @Column(name = "preferred_transport")
    private PreferredTransport preferredTransport;

    @Enumerated(EnumType.STRING)
    @Column(name = "preferred_accommodation")
    private PreferredAccommodation preferredAccommodation;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_interests", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "interest")
    @Builder.Default
    private List<String> interests = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_visited_places", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "place")
    @Builder.Default
    private List<String> visitedPlaces = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_bucket_list", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "place")
    @Builder.Default
    private List<String> bucketListPlaces = new ArrayList<>();

    @Column(name = "subscription_status")
    private String subscriptionStatus;

    // New users are verified by default; columnDefinition backfills existing rows.
    @Column(name = "verified", nullable = false, columnDefinition = "boolean not null default true")
    @Builder.Default
    private boolean verified = true;

    // Discover filters (woman-to-woman matching / verified-only).
    @Column(name = "filter_female_only", nullable = false, columnDefinition = "boolean not null default false")
    @Builder.Default
    private boolean filterFemaleOnly = false;

    @Column(name = "filter_verified_only", nullable = false, columnDefinition = "boolean not null default false")
    @Builder.Default
    private boolean filterVerifiedOnly = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
