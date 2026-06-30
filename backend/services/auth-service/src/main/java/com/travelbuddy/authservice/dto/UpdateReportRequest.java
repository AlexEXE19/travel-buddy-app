package com.travelbuddy.authservice.dto;

import com.travelbuddy.authservice.entity.ReportStatus;

/**
 * Admin update for a report. Optionally also sets the reported user's account
 * status in the same action (e.g. resolve report + ban user).
 */
public record UpdateReportRequest(
        ReportStatus status,
        String adminNote,
        String reportedAccountStatus
) {}
