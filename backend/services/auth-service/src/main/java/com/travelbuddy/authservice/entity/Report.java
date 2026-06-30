package com.travelbuddy.authservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "reporter_id", nullable = false)
    private UUID reporterId;

    @Column(name = "reported_user_id", nullable = false)
    private UUID reportedUserId;

    /** One or more selected reason codes (e.g. HARASSMENT, SPAM_OR_SCAM, ...). */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "report_reasons", joinColumns = @JoinColumn(name = "report_id"))
    @Column(name = "reason")
    @Builder.Default
    private List<String> reasons = new ArrayList<>();

    /** Free text supplied when the "OTHER" reason is selected. */
    @Column(length = 2000)
    private String details;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ReportStatus status = ReportStatus.PENDING;

    /** Admin note added while reviewing the report. */
    @Column(length = 2000)
    private String adminNote;

    /** Admin (user id) who last updated the report. */
    @Column(name = "reviewed_by")
    private UUID reviewedBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        createdAt = updatedAt = LocalDateTime.now();
        if (status == null) status = ReportStatus.PENDING;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
