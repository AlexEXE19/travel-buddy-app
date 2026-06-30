package com.travelbuddy.chatservice.repository;

import com.travelbuddy.chatservice.entity.ChatRoom;
import com.travelbuddy.chatservice.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, UUID> {
    Optional<ChatRoom> findByTypeAndReferenceId(RoomType type, UUID referenceId);
}
