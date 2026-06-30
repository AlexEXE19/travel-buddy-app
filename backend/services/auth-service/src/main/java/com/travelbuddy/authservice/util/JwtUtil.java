package com.travelbuddy.authservice.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

import static java.security.KeyRep.Type.SECRET;

@Component
public class JwtUtil {

    private final SecretKey key;

    public JwtUtil(@Value("${jwt.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String userId, String role) {
        return Jwts.builder()
                .subject(userId)
                .claim("role", role == null ? "USER" : role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 15*60*1000))
                .signWith(key)
                .compact();
    }
}