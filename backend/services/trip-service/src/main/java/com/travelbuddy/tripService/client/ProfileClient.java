package com.travelbuddy.tripservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.UUID;

@FeignClient(name = "trip-profile-client", url = "${PROFILE_SERVICE_URI}")
public interface ProfileClient {

    @PostMapping("/api/v1/profile/batch")
    List<ProfileSummary> getBatch(@RequestBody List<UUID> ids);
}
