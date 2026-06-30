package com.travelbuddy.profileservice.service;

import com.travelbuddy.profileservice.dto.UserStatsResponse;
import com.travelbuddy.profileservice.entity.UserProfile;
import com.travelbuddy.profileservice.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileStatsService {

    private final UserProfileRepository repository;

    public UserStatsResponse getStats() {
        List<UserProfile> all = repository.findAll();
        long total = all.size();
        long verified = all.stream().filter(UserProfile::isVerified).count();

        return new UserStatsResponse(
                total,
                verified,
                total - verified,
                countBy(all, p -> p.getGender() == null ? null : p.getGender().name()),
                countBy(all, p -> p.getPreferredTravelType() == null ? null : p.getPreferredTravelType().name()),
                countBy(all, p -> p.getBudgetRange() == null ? null : p.getBudgetRange().name()),
                countBy(all, p -> p.getPreferredClimate() == null ? null : p.getPreferredClimate().name()),
                ageGroups(all),
                topN(countBy(all, UserProfile::getNationality), 10),
                topN(flattenCount(all), 10)
        );
    }

    /** Count profiles by a single nullable string key, sorted by count desc. */
    private Map<String, Long> countBy(List<UserProfile> all, Function<UserProfile, String> key) {
        Map<String, Long> counts = new HashMap<>();
        for (UserProfile p : all) {
            String k = key.apply(p);
            if (k == null || k.isBlank()) continue;
            counts.merge(k, 1L, Long::sum);
        }
        return sortDesc(counts);
    }

    /** Count interest occurrences across all profiles. */
    private Map<String, Long> flattenCount(List<UserProfile> all) {
        Map<String, Long> counts = new HashMap<>();
        for (UserProfile p : all) {
            if (p.getInterests() == null) continue;
            for (String i : p.getInterests()) {
                if (i == null || i.isBlank()) continue;
                counts.merge(i, 1L, Long::sum);
            }
        }
        return counts;
    }

    private Map<String, Long> ageGroups(List<UserProfile> all) {
        // Keep a stable, ordered set of buckets so the chart axis is consistent.
        Map<String, Long> buckets = new LinkedHashMap<>();
        for (String b : List.of("18-24", "25-34", "35-44", "45-54", "55+")) buckets.put(b, 0L);
        LocalDate today = LocalDate.now();
        for (UserProfile p : all) {
            LocalDate dob = p.getDateOfBirth();
            if (dob == null) continue;
            int age = Period.between(dob, today).getYears();
            String bucket = age < 25 ? "18-24"
                    : age < 35 ? "25-34"
                    : age < 45 ? "35-44"
                    : age < 55 ? "45-54" : "55+";
            buckets.merge(bucket, 1L, Long::sum);
        }
        return buckets;
    }

    private Map<String, Long> topN(Map<String, Long> counts, int n) {
        return counts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(n)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue,
                        (a, b) -> a, LinkedHashMap::new));
    }

    private Map<String, Long> sortDesc(Map<String, Long> counts) {
        return counts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue,
                        (a, b) -> a, LinkedHashMap::new));
    }
}
