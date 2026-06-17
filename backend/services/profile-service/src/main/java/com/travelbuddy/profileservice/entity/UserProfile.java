package com.travelbuddy.profileservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

import java.time.LocalDate;
import java.time.LocalDateTime;

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

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    private String phone;

    private String gender;

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

    private Float budget;

    @Column(name = "subscription_status")
    private String subscriptionStatus;

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