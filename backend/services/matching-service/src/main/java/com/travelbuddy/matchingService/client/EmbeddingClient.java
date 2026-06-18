package com.travelbuddy.matching.client;


@FeignClient(name = "embedding-client", url = "${EMBEDDING_SERVICE_URI}")
public interface EmbeddingClient {

    @PostMapping("/embed")
    EmbeddingResponse embed(@RequestBody EmbeddingRequest request);
}