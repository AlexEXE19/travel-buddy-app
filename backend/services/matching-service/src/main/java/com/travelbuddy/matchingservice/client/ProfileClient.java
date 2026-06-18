package com.travelbuddy.matchingservice.client;

import com.travelbuddy.matchingservice.dto.ProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "profile-client", url = "${PROFILE_SERVICE_URI}")
public interface ProfileClient {

    @GetMapping("/api/v1/profile/{userId}")
    ProfileResponse getProfile(@PathVariable("userId") String userId);
}