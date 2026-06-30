package com.travelbuddy.chatservice.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record MessageDto(
    UUID id,
    UUID roomId,
    UUID senderId,
    String content,
    String type,
    UUID tripId,
    LocalDateTime sentAt,
    LocalDateTime editedAt,
    boolean deleted
) {}
