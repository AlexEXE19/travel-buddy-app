package com.travelbuddy.authservice.controller;

import com.travelbuddy.authservice.dto.AdminUserResponse;
import com.travelbuddy.authservice.dto.ReportResponse;
import com.travelbuddy.authservice.dto.UpdateAccountStatusRequest;
import com.travelbuddy.authservice.dto.UpdateReportRequest;
import com.travelbuddy.authservice.entity.ReportStatus;
import com.travelbuddy.authservice.service.AdminUserService;
import com.travelbuddy.authservice.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin-only user moderation and reports (requires ROLE_ADMIN)")
public class AdminController {

    private final AdminUserService adminUserService;
    private final ReportService reportService;

    @GetMapping("/overview")
    @Operation(summary = "Account-level counts for the admin dashboard")
    public ResponseEntity<Map<String, Object>> overview() {
        return ResponseEntity.ok(adminUserService.accountStats());
    }

    @GetMapping("/users")
    @Operation(summary = "List user accounts (optional ?status= filter)")
    public ResponseEntity<List<AdminUserResponse>> listUsers(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(adminUserService.listUsers(status));
    }

    @PatchMapping("/users/{userId}/status")
    @Operation(summary = "Set an account status (ACTIVE | SUSPENDED | BANNED)")
    public ResponseEntity<AdminUserResponse> setStatus(
            @PathVariable UUID userId,
            @Valid @RequestBody UpdateAccountStatusRequest request) {
        return ResponseEntity.ok(adminUserService.updateAccountStatus(userId, request.accountStatus()));
    }

    @GetMapping("/reports")
    @Operation(summary = "List reports (optional ?status= filter)")
    public ResponseEntity<List<ReportResponse>> listReports(@RequestParam(required = false) ReportStatus status) {
        return ResponseEntity.ok(reportService.list(status));
    }

    @PatchMapping("/reports/{reportId}")
    @Operation(summary = "Update a report; optionally set the reported user's account status")
    public ResponseEntity<ReportResponse> updateReport(
            Authentication authentication,
            @PathVariable UUID reportId,
            @RequestBody UpdateReportRequest request) {
        UUID adminId = UUID.fromString(authentication.getName());
        return ResponseEntity.ok(reportService.update(reportId, adminId, request));
    }
}
