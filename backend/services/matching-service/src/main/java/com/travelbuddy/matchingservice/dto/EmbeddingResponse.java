package com.travelbuddy.matchingservice.dto;
import java.util.List;

public record EmbeddingResponse(List<Float> embedding) {}