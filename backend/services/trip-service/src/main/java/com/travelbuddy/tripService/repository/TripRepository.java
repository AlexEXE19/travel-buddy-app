package com.travelbuddy.tripservice.repository;

import com.travelbuddy.tripservice.entity.Trip;
import com.travelbuddy.tripservice.enums.TripStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TripRepository extends JpaRepository<Trip, UUID> {

    List<Trip> findByCreatorId(UUID creatorId);

    List<Trip> findByCreatorIdAndStatus(UUID creatorId, TripStatus status);

    @Query("SELECT t FROM Trip t WHERE :memberId MEMBER OF t.members")
    List<Trip> findByMemberId(@Param("memberId") UUID memberId);

    @Query("SELECT t FROM Trip t WHERE :memberId MEMBER OF t.members AND t.status = :status")
    List<Trip> findByMemberIdAndStatus(@Param("memberId") UUID memberId, @Param("status") TripStatus status);

    List<Trip> findByStatus(TripStatus status);
    Optional<Trip> findByItineraryId(UUID itineraryId);

    long countByCreatorIdAndCreatedAtAfter(UUID creatorId, java.time.LocalDateTime after);
}