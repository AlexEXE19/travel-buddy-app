package com.travelbuddy.matchingservice.client;

import com.travelbuddy.matchingservice.dto.EmbeddingRequest;
import com.travelbuddy.matchingservice.dto.EmbeddingResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "embedding-client", url = "${EMBEDDING_SERVICE_URI}")
public interface EmbeddingClient {

    @PostMapping("/embed")
    EmbeddingResponse embed(@RequestBody EmbeddingRequest request);
}