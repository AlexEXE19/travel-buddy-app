package com.travelbuddy.matching.client;


@FeignClient(name = "profile-client", url = "${PROFILE_SERVICE_URI}")
public interface ProfileClient {

    @GetMapping("/api/v1/profile/{userId}")
    ProfileResponse getProfile(@PathVariable String userId);
}