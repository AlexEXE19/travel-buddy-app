package com.travelbuddy.chatservice.repository;

import com.travelbuddy.chatservice.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {
    @Query("SELECT m FROM ChatMessage m WHERE m.roomId = :roomId ORDER BY m.sentAt ASC")
    List<ChatMessage> findByRoomIdOrderBySentAt(@Param("roomId") UUID roomId);
}
