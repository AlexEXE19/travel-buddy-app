package com.travelbuddy.authservice.controller;

import com.travelbuddy.authservice.dto.AdminUserResponse;
import com.travelbuddy.authservice.dto.ReportResponse;
import com.travelbuddy.authservice.dto.UpdateAccountStatusRequest;
import com.travelbuddy.authservice.dto.UpdateReportRequest;
import com.travelbuddy.authservice.entity.ReportStatus;
import com.travelbuddy.authservice.entity.Role;
import com.travelbuddy.authservice.service.AdminUserService;
import com.travelbuddy.authservice.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin-only user moderation and reports (requires ROLE_ADMIN)")
public class AdminController {

    private final AdminUserService adminUserService;
    private final ReportService reportService;

    /** Defense-in-depth: the gateway already gates /admin/** to admins. */
    private void requireAdmin(String role) {
        if (!Role.ADMIN.equals(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin role required");
        }
    }

    @GetMapping("/overview")
    @Operation(summary = "Account-level counts for the admin dashboard")
    public ResponseEntity<Map<String, Object>> overview(@RequestHeader(value = "X-User-Role", required = false) String role) {
        requireAdmin(role);
        return ResponseEntity.ok(adminUserService.accountStats());
    }

    @GetMapping("/users")
    @Operation(summary = "List user accounts (optional ?status= filter)")
    public ResponseEntity<List<AdminUserResponse>> listUsers(
            @RequestHeader(value = "X-User-Role", required = false) String role,
            @RequestParam(required = false) String status) {
        requireAdmin(role);
        return ResponseEntity.ok(adminUserService.listUsers(status));
    }

    @PatchMapping("/users/{userId}/status")
    @Operation(summary = "Set an account status (ACTIVE | SUSPENDED | BANNED)")
    public ResponseEntity<AdminUserResponse> setStatus(
            @RequestHeader(value = "X-User-Role", required = false) String role,
            @PathVariable UUID userId,
            @Valid @RequestBody UpdateAccountStatusRequest request) {
        requireAdmin(role);
        return ResponseEntity.ok(adminUserService.updateAccountStatus(userId, request.accountStatus()));
    }

    @GetMapping("/reports")
    @Operation(summary = "List reports (optional ?status= filter)")
    public ResponseEntity<List<ReportResponse>> listReports(
            @RequestHeader(value = "X-User-Role", required = false) String role,
            @RequestParam(required = false) ReportStatus status) {
        requireAdmin(role);
        return ResponseEntity.ok(reportService.list(status));
    }

    @PatchMapping("/reports/{reportId}")
    @Operation(summary = "Update a report; optionally set the reported user's account status")
    public ResponseEntity<ReportResponse> updateReport(
            @RequestHeader(value = "X-User-Role", required = false) String role,
            @RequestHeader("X-User-Id") String adminId,
            @PathVariable UUID reportId,
            @RequestBody UpdateReportRequest request) {
        requireAdmin(role);
        return ResponseEntity.ok(reportService.update(reportId, UUID.fromString(adminId), request));
    }
}
