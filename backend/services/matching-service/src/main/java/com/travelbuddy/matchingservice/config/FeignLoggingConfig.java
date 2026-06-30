package com.travelbuddy.matchingservice.config;

import feign.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Logs the full request and response (line, headers and bodies) for every
 * outbound inter-service Feign call (profile-service, trip-service,
 * embedding-service). Feign emits these at DEBUG under the client interface's
 * package, enabled via logging.level.com.travelbuddy.matchingservice.client.
 */
@Configuration
public class FeignLoggingConfig {

    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }
}
