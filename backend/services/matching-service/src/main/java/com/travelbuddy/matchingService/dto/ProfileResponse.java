package com.travelbuddy.matchingservice.dto;


public record ProfileResponse(
        String travelStyle,
        Float budget,
        String preferredClimate,
        List<String> interests
) {}