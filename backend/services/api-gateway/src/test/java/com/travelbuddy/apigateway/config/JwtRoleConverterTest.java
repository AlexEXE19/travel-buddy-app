package com.travelbuddy.apigateway.config;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.Instant;
import java.util.Collection;

import static org.junit.jupiter.api.Assertions.*;

/** Unit tests for the JWT role → authority mapping. No Spring context. */
class JwtRoleConverterTest {

    private final JwtRoleConverter converter = new JwtRoleConverter();

    private Jwt jwtWithRole(String role) {
        Jwt.Builder builder = Jwt.withTokenValue("token")
                .header("alg", "HS256")
                .subject("user-1")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(60));
        if (role != null) {
            builder.claim("role", role);
        }
        return builder.build();
    }

    @Test
    void mapsRoleClaimToPrefixedAuthority() {
        Collection<GrantedAuthority> authorities = converter.convert(jwtWithRole("ADMIN"));
        assertTrue(authorities.stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));
    }

    @Test
    void missingRoleYieldsNoAuthorities() {
        assertTrue(converter.convert(jwtWithRole(null)).isEmpty());
    }
}
