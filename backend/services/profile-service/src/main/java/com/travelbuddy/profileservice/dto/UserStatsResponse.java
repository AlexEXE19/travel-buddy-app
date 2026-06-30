package com.travelbuddy.profileservice.dto;

import java.util.Map;

/** Aggregate, anonymous demographic stats for the admin dashboard. */
public record UserStatsResponse(
        long totalUsers,
        long verifiedUsers,
        long unverifiedUsers,
        Map<String, Long> byGender,
        Map<String, Long> byTravelType,
        Map<String, Long> byBudget,
        Map<String, Long> byClimate,
        Map<String, Long> byAgeGroup,
        Map<String, Long> topNationalities,
        Map<String, Long> topInterests
) {}
