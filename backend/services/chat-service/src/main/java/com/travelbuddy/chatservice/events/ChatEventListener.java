package com.travelbuddy.chatservice.events;

import com.travelbuddy.chatservice.config.RabbitConfig;
import com.travelbuddy.chatservice.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatEventListener {

    private final ChatService chatService;

    @RabbitListener(queues = RabbitConfig.MATCHED_QUEUE)
    public void onUserMatched(UserMatchedEvent event) {
        try {
            chatService.createDmRoom(event.userAId(), event.userBId());
            log.info("DM room created for {} and {}", event.userAId(), event.userBId());
        } catch (Exception e) {
            log.error("Failed to create DM room: {}", e.getMessage());
        }
    }

    @RabbitListener(queues = RabbitConfig.TRIP_QUEUE)
    public void onTripCreated(TripCreatedEvent event) {
        try {
            chatService.createTripRoom(event.tripId(), event.creatorId(), event.title());
            log.info("Trip room created for trip {}", event.tripId());
        } catch (Exception e) {
            log.error("Failed to create trip room: {}", e.getMessage());
        }
    }

    @RabbitListener(queues = RabbitConfig.JOINED_QUEUE)
    public void onUserJoinedTrip(UserJoinedTripEvent event) {
        try {
            chatService.addUserToTripRoom(event.tripId(), event.userId());
            log.info("User {} added to trip room {}", event.userId(), event.tripId());
        } catch (Exception e) {
            log.error("Failed to add user to trip room: {}", e.getMessage());
        }
    }
}
