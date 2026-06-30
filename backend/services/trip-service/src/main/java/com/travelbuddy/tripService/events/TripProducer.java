package com.travelbuddy.tripservice.service;

import com.travelbuddy.tripservice.config.RabbitConfig;
import com.travelbuddy.tripservice.events.TripCreatedEvent;
import com.travelbuddy.tripservice.events.UserJoinedTripEvent;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class TripProducer {

    private final RabbitTemplate rabbitTemplate;

    public TripProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendTripCreatedEvent(TripCreatedEvent event) {
        rabbitTemplate.convertAndSend(
                RabbitConfig.EXCHANGE,
                RabbitConfig.ROUTING_KEY,
                event
        );
    }

    public void sendUserJoinedTripEvent(UserJoinedTripEvent event) {
        rabbitTemplate.convertAndSend(
                RabbitConfig.EXCHANGE,
                RabbitConfig.USER_JOINED_ROUTING_KEY,
                event
        );
    }
}