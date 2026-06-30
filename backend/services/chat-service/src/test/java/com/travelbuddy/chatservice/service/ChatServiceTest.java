package com.travelbuddy.chatservice.service;

import com.travelbuddy.chatservice.client.TripClient;
import com.travelbuddy.chatservice.repository.ChatMessageRepository;
import com.travelbuddy.chatservice.repository.ChatRoomRepository;
import com.travelbuddy.chatservice.repository.RoomParticipantRepository;
import org.junit.jupiter.api.Test;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/** Unit tests for room-access authorization using mocked repositories. */
class ChatServiceTest {

    private final ChatRoomRepository roomRepo = mock(ChatRoomRepository.class);
    private final RoomParticipantRepository participantRepo = mock(RoomParticipantRepository.class);
    private final ChatMessageRepository messageRepo = mock(ChatMessageRepository.class);
    private final SimpMessagingTemplate messagingTemplate = mock(SimpMessagingTemplate.class);
    private final TripClient tripClient = mock(TripClient.class);

    private final ChatService service = new ChatService(
            roomRepo, participantRepo, messageRepo, messagingTemplate, tripClient);

    @Test
    void readingMessagesAsNonParticipantIsRejected() {
        when(participantRepo.existsByRoomIdAndUserId(any(), any())).thenReturn(false);
        assertThrows(SecurityException.class,
                () -> service.getMessages(UUID.randomUUID(), UUID.randomUUID()));
        verify(messageRepo, never()).findByRoomIdOrderBySentAt(any());
    }

    @Test
    void sendingMessageAsNonParticipantIsRejected() {
        when(participantRepo.existsByRoomIdAndUserId(any(), any())).thenReturn(false);
        assertThrows(SecurityException.class,
                () -> service.sendMessage(UUID.randomUUID(), UUID.randomUUID(), "hi"));
        verify(messageRepo, never()).save(any());
    }
}
