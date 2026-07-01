package com.travelbuddy.profileservice.controller;

import com.travelbuddy.profileservice.dto.AdminProfileSummary;
import com.travelbuddy.profileservice.dto.UserStatsResponse;
import com.travelbuddy.profileservice.service.ProfileService;
import com.travelbuddy.profileservice.service.ProfileStatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/profile/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Profile", description = "Admin demographics + profile verification (requires ROLE_ADMIN)")
public class AdminProfileController {

    private final ProfileStatsService statsService;
    private final ProfileService profileService;

    @GetMapping("/stats")
    @Operation(summary = "Aggregate, anonymous demographic statistics for the admin dashboard")
    public ResponseEntity<UserStatsResponse> stats() {
        return ResponseEntity.ok(statsService.getStats());
    }

    @GetMapping("/users")
    @Operation(summary = "List all profiles for the verification screen")
    public ResponseEntity<List<AdminProfileSummary>> users() {
        return ResponseEntity.ok(profileService.listAllForAdmin());
    }

    @PatchMapping("/users/{userId}/verified")
    @Operation(summary = "Verify or un-verify a profile after inspecting it")
    public ResponseEntity<AdminProfileSummary> setVerified(
            @PathVariable UUID userId,
            @RequestBody Map<String, Boolean> body) {
        boolean verified = Boolean.TRUE.equals(body.get("verified"));
        return ResponseEntity.ok(profileService.setVerified(userId.toString(), verified));
    }
}
