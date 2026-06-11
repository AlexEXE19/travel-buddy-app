package com.travelbuddy.profileservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "users_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

//    @Column(nullable = false, unique = true)
//    private String email;

    private String phone;

//    @Column(name = "password_hash", nullable = false)
//    private String passwordHash;

    private String gender;

    private String nationality;

    private Float budget;

    @Column(name = "subscription_status")
    private String subscriptionStatus;

//    @Column(name = "account_status")
//    private String accountStatus;
//
//    @Column(name = "created_at")
//    private LocalDateTime createdAt;
}