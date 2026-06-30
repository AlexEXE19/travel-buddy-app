package com.travelbuddy.chatservice.controller;

import com.travelbuddy.chatservice.dto.*;
import com.travelbuddy.chatservice.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/rooms")
    @Operation(summary = "Get all chat rooms for the current user")
    public ResponseEntity<List<RoomDto>> getRooms(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(chatService.getRoomsForUser(UUID.fromString(userId)));
    }

    @GetMapping("/rooms/{roomId}/messages")
    @Operation(summary = "Get all messages in a room")
    public ResponseEntity<List<MessageDto>> getMessages(
            @PathVariable UUID roomId,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(chatService.getMessages(roomId, UUID.fromString(userId)));
    }
}
