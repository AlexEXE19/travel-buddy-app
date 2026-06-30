package com.travelbuddy.matchingservice.repository;

import com.travelbuddy.matchingservice.entity.Connection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, UUID> {

    Optional<Connection> findByUserAIdAndUserBId(UUID userAId, UUID userBId);

    @Query("SELECT c FROM Connection c WHERE (c.userAId = :userId OR c.userBId = :userId) AND c.status = 'MATCHED'")
    List<Connection> findMatchedConnections(@Param("userId") UUID userId);
}
