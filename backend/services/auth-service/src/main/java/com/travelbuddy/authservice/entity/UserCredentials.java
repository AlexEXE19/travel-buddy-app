package com.travelbuddy.authservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users_credentials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCredentials {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

//    @Column(name = "first_name", nullable = false)
//    private String firstName;
//
//    @Column(name = "last_name", nullable = false)
//    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

//    private String phone;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

//    private String gender;
//
//    private String nationality;
//
//    private Float budget;
//
//    @Column(name = "subscription_status")
//    private String subscriptionStatus;

    @Column(name = "account_status")
    private String accountStatus;

    @Column(name = "role")
    private String role;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}