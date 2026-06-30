package com.travelbuddy.apigateway.util;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class JwtGatewayFilter implements GlobalFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtGatewayFilter.class);
    private final JwtUtil jwtUtil;

    public JwtGatewayFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();

       if (
    path.contains("/api/v1/auth") ||
    path.contains("/swagger-ui") ||
    path.contains("/v3/api-docs")
) {
    return chain.filter(exchange);
}

        HttpCookie authCookie = request.getCookies().getFirst("AUTH_TOKEN");


        if (authCookie == null) {
            log.warn("Blocked unauthorized request to path: {} - Missing AUTH_TOKEN cookie", path);
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = authCookie.getValue();

        try {
            String extractedUserId = jwtUtil.extractUserId(token);

            if (extractedUserId == null || jwtUtil.isTokenExpired(token)) {
                log.warn("Invalid or expired token attempting to access path: {}", path);
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            String role = jwtUtil.extractRole(token);

            // Admin-only area: any path segment "/admin/" requires ROLE ADMIN.
            if (path.contains("/admin/") && !"ADMIN".equals(role)) {
                log.warn("Blocked non-admin (role={}) from admin path: {}", role, path);
                exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                return exchange.getResponse().setComplete();
            }

            log.info("Gateway mutating request for path [{}]. Injecting headers: X-User-Id={}, X-User-Role={}",
                    path, extractedUserId, role);

            ServerHttpRequest mutatedRequest = request.mutate()
                    .header("X-User-Id", extractedUserId)
                    .header("X-User-Role", role)
                    .build();

            return chain.filter(exchange.mutate().request(mutatedRequest).build());

        } catch (Exception e) {
            log.error("Exception occurred during JWT authentication filter processing", e);
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
    }
}