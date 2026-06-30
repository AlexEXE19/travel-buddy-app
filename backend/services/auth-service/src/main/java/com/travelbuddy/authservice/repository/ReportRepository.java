package com.travelbuddy.authservice.repository;

import com.travelbuddy.authservice.entity.Report;
import com.travelbuddy.authservice.entity.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReportRepository extends JpaRepository<Report, UUID> {
    List<Report> findAllByOrderByCreatedAtDesc();
    List<Report> findByStatusOrderByCreatedAtDesc(ReportStatus status);
    long countByStatus(ReportStatus status);
}
