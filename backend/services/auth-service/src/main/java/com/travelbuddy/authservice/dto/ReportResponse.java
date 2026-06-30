package com.travelbuddy.authservice.dto;

import com.travelbuddy.authservice.entity.Report;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ReportResponse(
        UUID id,
        UUID reporterId,
        UUID reportedUserId,
        List<String> reasons,
        String details,
        String status,
        String adminNote,
        UUID reviewedBy,
        String reportedAccountStatus,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ReportResponse from(Report r, String reportedAccountStatus) {
        return new ReportResponse(
                r.getId(), r.getReporterId(), r.getReportedUserId(),
                r.getReasons(), r.getDetails(), r.getStatus().name(),
                r.getAdminNote(), r.getReviewedBy(), reportedAccountStatus,
                r.getCreatedAt(), r.getUpdatedAt()
        );
    }
}
