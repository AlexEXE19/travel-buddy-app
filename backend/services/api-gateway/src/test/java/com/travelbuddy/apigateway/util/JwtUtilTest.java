package com.travelbuddy.apigateway.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;

import javax.crypto.SecretKey;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

/** Unit tests for gateway JWT verification — no Spring context, no infrastructure. */
class JwtUtilTest {

    private static final String SECRET = "test-secret-key-that-is-at-least-32-bytes-long!";
    private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes());
    private final JwtUtil jwtUtil = new JwtUtil(SECRET);

    private String token(String userId, String role, long ttlMillis) {
        var builder = Jwts.builder()
                .subject(userId)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + ttlMillis))
                .signWith(key);
        if (role != null) builder.claim("role", role);
        return builder.compact();
    }

    @Test
    void extractsUserIdAndRoleFromValidToken() {
        String t = token("user-123", "ADMIN", 60_000);
        assertEquals("user-123", jwtUtil.extractUserId(t));
        assertEquals("ADMIN", jwtUtil.extractRole(t));
        assertFalse(jwtUtil.isTokenExpired(t));
    }

    @Test
    void defaultsRoleToUserWhenClaimMissing() {
        assertEquals("USER", jwtUtil.extractRole(token("user-1", null, 60_000)));
    }

    @Test
    void rejectsTokenSignedWithDifferentKey() {
        SecretKey otherKey = Keys.hmacShaKeyFor("a-totally-different-secret-key-32-bytes!!".getBytes());
        String forged = Jwts.builder().subject("attacker").claim("role", "ADMIN")
                .issuedAt(new Date()).expiration(new Date(System.currentTimeMillis() + 60_000))
                .signWith(otherKey).compact();
        assertThrows(Exception.class, () -> jwtUtil.extractUserId(forged));
    }

    @Test
    void rejectsExpiredToken() {
        String expired = token("user-1", "USER", -1_000);
        assertThrows(Exception.class, () -> jwtUtil.isTokenExpired(expired));
    }
}
