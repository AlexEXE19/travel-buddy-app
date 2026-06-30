package com.travelbuddy.chatservice.service;

import com.travelbuddy.chatservice.client.TripClient;
import com.travelbuddy.chatservice.dto.*;
import com.travelbuddy.chatservice.entity.*;
import com.travelbuddy.chatservice.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRoomRepository roomRepo;
    private final RoomParticipantRepository participantRepo;
    private final ChatMessageRepository messageRepo;
    private final SimpMessagingTemplate messagingTemplate;
    private final TripClient tripClient;

    // Called when two users match — creates a DM room
    public void createDmRoom(UUID userAId, UUID userBId) {
        List<UUID> aRooms = participantRepo.findByUserId(userAId).stream()
                .map(RoomParticipant::getRoomId).toList();
        List<UUID> bRooms = participantRepo.findByUserId(userBId).stream()
                .map(RoomParticipant::getRoomId).toList();

        // Check for existing shared DM room
        boolean exists = aRooms.stream()
                .filter(bRooms::contains)
                .map(rid -> roomRepo.findById(rid).orElse(null))
                .filter(Objects::nonNull)
                .anyMatch(r -> r.getType() == RoomType.DM);
        if (exists) return;

        ChatRoom room = roomRepo.save(ChatRoom.builder().type(RoomType.DM).build());
        participantRepo.save(RoomParticipant.builder().roomId(room.getId()).userId(userAId).build());
        participantRepo.save(RoomParticipant.builder().roomId(room.getId()).userId(userBId).build());
    }

    // Called when a trip is created — creates trip room + TRIP_SHARE messages in all DM rooms of creator
    public void createTripRoom(UUID tripId, UUID creatorId, String title) {
        if (roomRepo.findByTypeAndReferenceId(RoomType.TRIP, tripId).isPresent()) return;

        ChatRoom room = roomRepo.save(ChatRoom.builder()
                .type(RoomType.TRIP).referenceId(tripId).name(title).build());
        participantRepo.save(RoomParticipant.builder().roomId(room.getId()).userId(creatorId).build());

        // Find all DM rooms where creator is a participant
        List<UUID> creatorDmRooms = participantRepo.findByUserId(creatorId).stream()
                .map(RoomParticipant::getRoomId)
                .filter(rid -> roomRepo.findById(rid)
                        .map(r -> r.getType() == RoomType.DM).orElse(false))
                .toList();

        // Post TRIP_SHARE in each DM room
        for (UUID dmRoomId : creatorDmRooms) {
            ChatMessage share = messageRepo.save(ChatMessage.builder()
                    .roomId(dmRoomId)
                    .senderId(creatorId)
                    .content(title)
                    .type(MessageType.TRIP_SHARE)
                    .tripId(tripId)
                    .build());
            broadcast(dmRoomId, "NEW_MESSAGE", toDto(share));
        }
    }

    // Add user to trip room when they join the trip
    public void addUserToTripRoom(UUID tripId, UUID userId) {
        roomRepo.findByTypeAndReferenceId(RoomType.TRIP, tripId).ifPresent(room -> {
            if (!participantRepo.existsByRoomIdAndUserId(room.getId(), userId)) {
                participantRepo.save(RoomParticipant.builder()
                        .roomId(room.getId()).userId(userId).build());
            }
        });
    }

    // Ensure trip rooms exist for every trip the user created or joined.
    // Backfills rooms for trips that pre-date the chat service (e.g. seed data)
    // and self-heals if a trip.created/joined event was ever missed.
    public void syncTripRooms(UUID userId) {
        List<TripSummary> trips;
        try {
            trips = Stream.concat(
                    tripClient.getCreatedTrips(userId.toString()).stream(),
                    tripClient.getJoinedTrips(userId.toString()).stream()
            ).toList();
        } catch (Exception e) {
            log.warn("Could not sync trip rooms for {}: {}", userId, e.getMessage());
            return;
        }

        for (TripSummary trip : trips) {
            if (trip.id() == null) continue;
            ChatRoom room = roomRepo.findByTypeAndReferenceId(RoomType.TRIP, trip.id())
                    .orElseGet(() -> roomRepo.save(ChatRoom.builder()
                            .type(RoomType.TRIP).referenceId(trip.id()).name(trip.title()).build()));
            // Backfill the name if a room pre-dated this column
            if (room.getName() == null && trip.title() != null) {
                room.setName(trip.title());
                roomRepo.save(room);
            }
            if (!participantRepo.existsByRoomIdAndUserId(room.getId(), userId)) {
                participantRepo.save(RoomParticipant.builder()
                        .roomId(room.getId()).userId(userId).build());
            }
        }
    }

    // Get all rooms for a user
    public List<RoomDto> getRoomsForUser(UUID userId) {
        syncTripRooms(userId);

        List<UUID> roomIds = participantRepo.findByUserId(userId).stream()
                .map(RoomParticipant::getRoomId).toList();

        return roomIds.stream().map(rid -> {
            ChatRoom room = roomRepo.findById(rid).orElseThrow();
            List<UUID> participants = participantRepo.findByRoomId(rid).stream()
                    .map(RoomParticipant::getUserId).toList();
            List<ChatMessage> msgs = messageRepo.findByRoomIdOrderBySentAt(rid);
            MessageDto last = msgs.isEmpty() ? null : toDto(msgs.get(msgs.size() - 1));
            return new RoomDto(room.getId(), room.getType().name(), room.getReferenceId(),
                    room.getName(), room.getCreatedAt(), participants, last);
        }).collect(Collectors.toList());
    }

    // Get messages for a room
    public List<MessageDto> getMessages(UUID roomId, UUID requestingUserId) {
        if (!participantRepo.existsByRoomIdAndUserId(roomId, requestingUserId)) {
            throw new SecurityException("Not a participant of this room");
        }
        return messageRepo.findByRoomIdOrderBySentAt(roomId).stream()
                .map(this::toDto).toList();
    }

    // Send a new text message
    public MessageDto sendMessage(UUID roomId, UUID senderId, String content) {
        if (!participantRepo.existsByRoomIdAndUserId(roomId, senderId)) {
            throw new SecurityException("Not a participant");
        }
        ChatMessage msg = messageRepo.save(ChatMessage.builder()
                .roomId(roomId).senderId(senderId)
                .content(content).type(MessageType.TEXT).build());
        MessageDto dto = toDto(msg);
        broadcast(roomId, "NEW_MESSAGE", dto);
        return dto;
    }

    // Edit a message
    public MessageDto editMessage(UUID roomId, UUID messageId, UUID requesterId, String newContent) {
        ChatMessage msg = messageRepo.findById(messageId)
                .orElseThrow(() -> new NoSuchElementException("Message not found"));
        if (!msg.getSenderId().equals(requesterId)) throw new SecurityException("Not the sender");
        if (msg.getDeletedAt() != null) throw new IllegalStateException("Cannot edit deleted message");
        msg.setContent(newContent);
        msg.setEditedAt(LocalDateTime.now());
        messageRepo.save(msg);
        MessageDto dto = toDto(msg);
        broadcast(roomId, "EDIT_MESSAGE", dto);
        return dto;
    }

    // Delete a message (soft delete)
    public void deleteMessage(UUID roomId, UUID messageId, UUID requesterId) {
        ChatMessage msg = messageRepo.findById(messageId)
                .orElseThrow(() -> new NoSuchElementException("Message not found"));
        if (!msg.getSenderId().equals(requesterId)) throw new SecurityException("Not the sender");
        msg.setDeletedAt(LocalDateTime.now());
        msg.setContent(null);
        messageRepo.save(msg);
        broadcast(roomId, "DELETE_MESSAGE", toDto(msg));
    }

    private void broadcast(UUID roomId, String eventType, Object payload) {
        messagingTemplate.convertAndSend("/topic/room/" + roomId, new WsEvent(eventType, payload));
    }

    private MessageDto toDto(ChatMessage m) {
        return new MessageDto(
                m.getId(), m.getRoomId(), m.getSenderId(),
                m.getDeletedAt() != null ? null : m.getContent(),
                m.getType().name(), m.getTripId(),
                m.getSentAt(), m.getEditedAt(),
                m.getDeletedAt() != null);
    }
}
