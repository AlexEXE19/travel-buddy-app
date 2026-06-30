package com.travelbuddy.chatservice.client;

import com.travelbuddy.chatservice.dto.TripSummary;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@FeignClient(name = "trip-service", url = "${TRIP_SERVICE_URI}")
public interface TripClient {

    @GetMapping("/api/v1/trips/me/created")
    List<TripSummary> getCreatedTrips(@RequestHeader("X-User-Id") String userId);

    @GetMapping("/api/v1/trips/me/joined")
    List<TripSummary> getJoinedTrips(@RequestHeader("X-User-Id") String userId);
}
