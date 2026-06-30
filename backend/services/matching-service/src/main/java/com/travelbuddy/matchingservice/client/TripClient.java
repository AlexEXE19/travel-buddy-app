package com.travelbuddy.matchingservice.client;

import com.travelbuddy.matchingservice.dto.TripSummaryResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.UUID;

@FeignClient(name = "trip-client", url = "${TRIP_SERVICE_URI}")
public interface TripClient {

    @PostMapping("/api/v1/trips/batch")
    List<TripSummaryResponse> getBatchTrips(@RequestBody List<UUID> ids);

    @GetMapping("/api/v1/trips/open")
    List<TripSummaryResponse> getOpenTrips();
}
