package com.travelbuddy.apigateway.util;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/**
 * Runs after Spring Security has authenticated the request and copies the
 * verified identity into X-User-Id / X-User-Role headers for the downstream
 * (servlet) services. Any client-supplied identity headers are removed first,
 * so they can never be spoofed through the gateway. Public paths carry no
 * authentication and are forwarded unchanged.
 */
@Component
public class IdentityPropagationFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(auth -> auth instanceof JwtAuthenticationToken)
                .cast(JwtAuthenticationToken.class)
                .map(auth -> exchange.mutate().request(request -> request.headers(headers -> {
                    headers.remove("X-User-Id");
                    headers.remove("X-User-Role");
                    headers.set("X-User-Id", auth.getToken().getSubject());
                    headers.set("X-User-Role", auth.getToken().getClaimAsString("role"));
                })).build())
                .defaultIfEmpty(exchange)
                .flatMap(chain::filter);
    }

    @Override
    public int getOrder() {
        // After GatewayLoggingFilter (HIGHEST_PRECEDENCE), before the routing filter.
        return 0;
    }
}
