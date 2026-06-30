package com.travelbuddy.authservice.logging;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Logs the full inbound HTTP request and response — method, path, headers, body,
 * status and latency — for every API call this service handles. Runs before
 * Spring Security so even rejected (401/403) requests are recorded.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class HttpLoggingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger("com.travelbuddy.http");
    private static final int MAX_BODY = 8192;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String uri = request.getRequestURI();
        return uri.startsWith("/actuator")
                || uri.startsWith("/v3/api-docs")
                || uri.startsWith("/swagger-ui")
                || uri.equals("/favicon.ico")
                || uri.startsWith("/ws")
                || "websocket".equalsIgnoreCase(request.getHeader("Upgrade"));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        ContentCachingRequestWrapper req = new ContentCachingRequestWrapper(request, MAX_BODY);
        ContentCachingResponseWrapper res = new ContentCachingResponseWrapper(response);
        long start = System.nanoTime();
        try {
            chain.doFilter(req, res);
        } finally {
            long ms = (System.nanoTime() - start) / 1_000_000;
            String query = request.getQueryString() == null ? "" : "?" + request.getQueryString();
            String line = request.getMethod() + " " + request.getRequestURI() + query;

            log.info("▶ IN  {}  headers=[{}]", line, headers(request));
            String reqBody = asText(req.getContentAsByteArray());
            if (!reqBody.isEmpty()) {
                log.info("▶ IN  {}  body={}", line, reqBody);
            }

            log.info("◀ OUT {}  status={} ({} ms)", line, res.getStatus(), ms);
            String resBody = asText(res.getContentAsByteArray());
            if (!resBody.isEmpty()) {
                log.info("◀ OUT {}  body={}", line, resBody);
            }

            res.copyBodyToResponse();
        }
    }

    private static String headers(HttpServletRequest request) {
        Enumeration<String> names = request.getHeaderNames();
        if (names == null) return "";
        return Collections.list(names).stream()
                .map(n -> n + "=" + mask(n, request.getHeader(n)))
                .collect(Collectors.joining(", "));
    }

    /** Show that a secret header was present without dumping the whole token. */
    private static String mask(String name, String value) {
        if (value == null) return "";
        String lower = name.toLowerCase();
        if (lower.equals("authorization") || lower.equals("cookie")) {
            return value.length() <= 12 ? "***" : value.substring(0, 12) + "…(masked)";
        }
        return value;
    }

    private static String asText(byte[] body) {
        if (body == null || body.length == 0) return "";
        String text = new String(body, 0, Math.min(body.length, MAX_BODY), StandardCharsets.UTF_8)
                .replaceAll("\\s+", " ").trim();
        return body.length > MAX_BODY ? text + " …(truncated)" : text;
    }
}
