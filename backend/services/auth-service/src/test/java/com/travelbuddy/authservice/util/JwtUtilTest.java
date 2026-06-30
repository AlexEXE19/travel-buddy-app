package com.travelbuddy.authservice.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;

import javax.crypto.SecretKey;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

/** Unit tests for token generation — no Spring context, no infrastructure. */
class JwtUtilTest {

    private static final String SECRET = "test-secret-key-that-is-at-least-32-bytes-long!";
    private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes());
    private final JwtUtil jwtUtil = new JwtUtil(SECRET);

    private Claims parse(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }

    @Test
    void generatesSignedTokenWithSubjectRoleAndFutureExpiry() {
        Claims claims = parse(jwtUtil.generateToken("user-1", "ADMIN"));
        assertEquals("user-1", claims.getSubject());
        assertEquals("ADMIN", claims.get("role"));
        assertTrue(claims.getExpiration().after(new Date()));
    }

    @Test
    void defaultsNullRoleToUser() {
        assertEquals("USER", parse(jwtUtil.generateToken("user-2", null)).get("role"));
    }
}
