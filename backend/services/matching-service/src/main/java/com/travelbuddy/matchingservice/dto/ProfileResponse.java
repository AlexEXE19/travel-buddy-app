package com.travelbuddy.matchingservice.dto;
import java.util.List;

public record ProfileResponse(
        String travelStyle,
        Float budget,
        String preferredClimate,
        List<String> interests
) {}