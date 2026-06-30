package com.travelbuddy.chatservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "chat_messages")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChatMessage {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "room_id", nullable = false)
    private UUID roomId;

    @Column(name = "sender_id", nullable = false)
    private UUID senderId;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessageType type;

    private UUID tripId; // set only for TRIP_SHARE messages

    private LocalDateTime sentAt;
    private LocalDateTime editedAt;
    private LocalDateTime deletedAt;

    @PrePersist
    void onCreate() { sentAt = LocalDateTime.now(); }
}
