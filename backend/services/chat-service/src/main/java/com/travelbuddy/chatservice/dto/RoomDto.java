package com.travelbuddy.chatservice.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record RoomDto(
    UUID id,
    String type,
    UUID referenceId,
    String name,
    LocalDateTime createdAt,
    List<UUID> participantIds,
    MessageDto lastMessage
) {}
