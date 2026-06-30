package com.travelbuddy.apigateway.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/**
 * Logs every request entering and leaving the gateway (client ↔ gateway):
 * method, URI, headers, response status and latency. The request/response
 * bodies are identical to what the destination service logs, so they are
 * captured there rather than buffered (and risked) in the reactive pipeline.
 * Runs first so even unauthorized requests are recorded.
 */
@Component
public class GatewayLoggingFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger("com.travelbuddy.http");

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String line = request.getMethod() + " " + request.getURI();
        long start = System.nanoTime();

        log.info("▶ GATEWAY IN  {}  headers=[{}]", line, headers(request));

        return chain.filter(exchange).doFinally(signal -> {
            long ms = (System.nanoTime() - start) / 1_000_000;
            log.info("◀ GATEWAY OUT {}  status={} ({} ms)", line, exchange.getResponse().getStatusCode(), ms);
        });
    }

    /** Curated, secret-safe header summary using only stable HttpHeaders methods. */
    private static String headers(ServerHttpRequest request) {
        HttpHeaders h = request.getHeaders();
        StringBuilder sb = new StringBuilder();
        append(sb, "Host", h.getFirst("Host"));
        append(sb, "Content-Type", h.getFirst(HttpHeaders.CONTENT_TYPE));
        append(sb, "Content-Length", h.getFirst(HttpHeaders.CONTENT_LENGTH));
        append(sb, "X-User-Id", h.getFirst("X-User-Id"));
        append(sb, "User-Agent", h.getFirst(HttpHeaders.USER_AGENT));
        append(sb, "Authorization", h.getFirst(HttpHeaders.AUTHORIZATION) != null ? "***(masked)" : null);
        append(sb, "Cookie", h.getFirst("Cookie") != null ? "***(masked)" : null);
        return sb.toString();
    }

    private static void append(StringBuilder sb, String name, String value) {
        if (value == null) return;
        if (sb.length() > 0) sb.append(", ");
        sb.append(name).append("=").append(value);
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }
}
