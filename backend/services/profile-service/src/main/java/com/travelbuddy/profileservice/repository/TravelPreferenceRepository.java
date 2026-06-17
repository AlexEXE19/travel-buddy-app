package com.travelbuddy.profileservice.repository;

import com.travelbuddy.profileservice.entity.TravelPreference;
import com.travelbuddy.profileservice.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TravelPreferenceRepository extends JpaRepository<TravelPreference, UUID> {
    Optional<TravelPreference> findByProfile(UserProfile profile);
}