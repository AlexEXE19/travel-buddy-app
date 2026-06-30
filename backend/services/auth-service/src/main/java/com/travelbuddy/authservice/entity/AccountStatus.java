package com.travelbuddy.authservice.entity;

import java.util.Set;

/** Allowed values for {@code users_credentials.account_status} (stored as String). */
public final class AccountStatus {
    public static final String ACTIVE = "ACTIVE";
    public static final String SUSPENDED = "SUSPENDED";
    public static final String BANNED = "BANNED";

    public static final Set<String> ALL = Set.of(ACTIVE, SUSPENDED, BANNED);

    private AccountStatus() {}

    public static boolean isValid(String s) {
        return s != null && ALL.contains(s);
    }
}
