package com.travelbuddy.authservice.repository;

import com.travelbuddy.authservice.entity.UserCredentials;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserCredentialsRepository extends JpaRepository<UserCredentials, UUID> {

    Optional<UserCredentials> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByAccountStatus(String accountStatus);
}