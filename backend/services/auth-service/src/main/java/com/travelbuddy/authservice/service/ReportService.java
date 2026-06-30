package com.travelbuddy.authservice.service;

import com.travelbuddy.authservice.dto.CreateReportRequest;
import com.travelbuddy.authservice.dto.ReportResponse;
import com.travelbuddy.authservice.dto.UpdateReportRequest;
import com.travelbuddy.authservice.entity.AccountStatus;
import com.travelbuddy.authservice.entity.Report;
import com.travelbuddy.authservice.entity.ReportStatus;
import com.travelbuddy.authservice.entity.UserCredentials;
import com.travelbuddy.authservice.repository.ReportRepository;
import com.travelbuddy.authservice.repository.UserCredentialsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserCredentialsRepository userRepository;

    /** A regular user files a report against another user. */
    public ReportResponse create(UUID reporterId, CreateReportRequest req) {
        if (req.reportedUserId().equals(reporterId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot report yourself");
        }
        if (!userRepository.existsById(req.reportedUserId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Reported user not found");
        }
        Report report = Report.builder()
                .reporterId(reporterId)
                .reportedUserId(req.reportedUserId())
                .reasons(req.reasons() == null ? new ArrayList<>() : new ArrayList<>(req.reasons()))
                .details(req.details())
                .status(ReportStatus.PENDING)
                .build();
        report = reportRepository.save(report);
        return ReportResponse.from(report, accountStatusOf(report.getReportedUserId()));
    }

    /** Admin: list reports, optionally filtered by status. */
    public List<ReportResponse> list(ReportStatus statusFilter) {
        List<Report> reports = (statusFilter == null)
                ? reportRepository.findAllByOrderByCreatedAtDesc()
                : reportRepository.findByStatusOrderByCreatedAtDesc(statusFilter);
        return reports.stream()
                .map(r -> ReportResponse.from(r, accountStatusOf(r.getReportedUserId())))
                .toList();
    }

    /**
     * Admin: update a report's status / note, and optionally change the reported
     * user's account status (e.g. resolve + ban) in the same action.
     */
    public ReportResponse update(UUID reportId, UUID adminId, UpdateReportRequest req) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found"));

        if (req.status() != null) report.setStatus(req.status());
        if (req.adminNote() != null) report.setAdminNote(req.adminNote());
        report.setReviewedBy(adminId);
        reportRepository.save(report);

        if (req.reportedAccountStatus() != null && !req.reportedAccountStatus().isBlank()) {
            String status = req.reportedAccountStatus();
            if (!AccountStatus.isValid(status)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Invalid account status. Allowed: " + AccountStatus.ALL);
            }
            UserCredentials reported = userRepository.findById(report.getReportedUserId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reported user not found"));
            reported.setAccountStatus(status);
            userRepository.save(reported);
        }

        return ReportResponse.from(report, accountStatusOf(report.getReportedUserId()));
    }

    public long countByStatus(ReportStatus status) {
        return reportRepository.countByStatus(status);
    }

    private String accountStatusOf(UUID userId) {
        return userRepository.findById(userId)
                .map(UserCredentials::getAccountStatus)
                .orElse(null);
    }
}
