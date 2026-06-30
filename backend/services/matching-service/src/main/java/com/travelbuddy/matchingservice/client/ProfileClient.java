package com.travelbuddy.matchingservice.client;

import com.travelbuddy.matchingservice.dto.ProfileMatchingData;
import com.travelbuddy.matchingservice.dto.UserProfileSummary;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;
import java.util.UUID;

@FeignClient(name = "profile-client", url = "${PROFILE_SERVICE_URI}")
public interface ProfileClient {

    @GetMapping("/api/v1/profile/for-matching")
    ProfileMatchingData getProfileForMatching(@RequestHeader("X-User-Id") String userId);

    @PostMapping("/api/v1/profile/batch")
    List<UserProfileSummary> getBatchProfiles(@RequestBody List<UUID> ids);
}
