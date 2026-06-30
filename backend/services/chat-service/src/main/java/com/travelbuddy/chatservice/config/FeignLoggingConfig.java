package com.travelbuddy.chatservice.config;

import feign.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Logs the full request and response (line, headers and bodies) for every
 * outbound inter-service Feign call (trip-service). Feign emits these at DEBUG
 * under the client interface's package, enabled via
 * logging.level.com.travelbuddy.chatservice.client.
 */
@Configuration
public class FeignLoggingConfig {

    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }
}
