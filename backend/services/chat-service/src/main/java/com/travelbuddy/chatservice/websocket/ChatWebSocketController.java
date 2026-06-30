package com.travelbuddy.chatservice.websocket;

import com.travelbuddy.chatservice.dto.EditMessageRequest;
import com.travelbuddy.chatservice.dto.SendMessageRequest;
import com.travelbuddy.chatservice.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final ChatService chatService;

    @MessageMapping("/room/{roomId}/message")
    public void sendMessage(@DestinationVariable UUID roomId,
                            @Payload SendMessageRequest request,
                            Principal principal) {
        chatService.sendMessage(roomId, UUID.fromString(principal.getName()), request.content());
    }

    @MessageMapping("/room/{roomId}/message/{messageId}/edit")
    public void editMessage(@DestinationVariable UUID roomId,
                            @DestinationVariable UUID messageId,
                            @Payload EditMessageRequest request,
                            Principal principal) {
        chatService.editMessage(roomId, messageId, UUID.fromString(principal.getName()), request.content());
    }

    @MessageMapping("/room/{roomId}/message/{messageId}/delete")
    public void deleteMessage(@DestinationVariable UUID roomId,
                              @DestinationVariable UUID messageId,
                              Principal principal) {
        chatService.deleteMessage(roomId, messageId, UUID.fromString(principal.getName()));
    }
}
