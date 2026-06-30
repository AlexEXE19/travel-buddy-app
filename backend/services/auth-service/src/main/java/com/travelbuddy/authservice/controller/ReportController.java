package com.travelbuddy.authservice.controller;

import com.travelbuddy.authservice.dto.CreateReportRequest;
import com.travelbuddy.authservice.dto.ReportResponse;
import com.travelbuddy.authservice.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@Tag(name = "Reports", description = "Users report other users for review by an admin")
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    @Operation(summary = "File a report against another user")
    public ResponseEntity<ReportResponse> create(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody CreateReportRequest request) {
        ReportResponse created = reportService.create(UUID.fromString(userId), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
