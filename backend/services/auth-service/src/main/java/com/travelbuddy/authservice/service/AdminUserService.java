package com.travelbuddy.authservice.service;

import com.travelbuddy.authservice.dto.AdminUserResponse;
import com.travelbuddy.authservice.entity.AccountStatus;
import com.travelbuddy.authservice.entity.ReportStatus;
import com.travelbuddy.authservice.entity.UserCredentials;
import com.travelbuddy.authservice.repository.ReportRepository;
import com.travelbuddy.authservice.repository.UserCredentialsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserCredentialsRepository userRepository;
    private final ReportRepository reportRepository;

    public List<AdminUserResponse> listUsers(String statusFilter) {
        return userRepository.findAll().stream()
                .filter(u -> statusFilter == null || statusFilter.equalsIgnoreCase(u.getAccountStatus()))
                .map(AdminUserResponse::from)
                .toList();
    }

    public AdminUserResponse updateAccountStatus(UUID userId, String status) {
        if (!AccountStatus.isValid(status)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invalid account status. Allowed: " + AccountStatus.ALL);
        }
        UserCredentials user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        user.setAccountStatus(status);
        userRepository.save(user);
        return AdminUserResponse.from(user);
    }

    /** Lightweight account-level counts for the admin overview. */
    public Map<String, Object> accountStats() {
        long total = userRepository.count();
        return Map.of(
                "totalUsers", total,
                "active", userRepository.countByAccountStatus(AccountStatus.ACTIVE),
                "suspended", userRepository.countByAccountStatus(AccountStatus.SUSPENDED),
                "banned", userRepository.countByAccountStatus(AccountStatus.BANNED),
                "pendingReports", reportRepository.countByStatus(ReportStatus.PENDING)
        );
    }
}
