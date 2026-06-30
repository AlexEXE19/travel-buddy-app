package com.travelbuddy.chatservice.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    // Listen to user.matched events (from matching service)
    public static final String USER_EXCHANGE = "user.exchange";
    public static final String MATCHED_QUEUE = "user.matched.chat.queue";
    public static final String MATCHED_KEY   = "user.matched";

    // Listen to trip.created events (from trip service)
    public static final String TRIP_EXCHANGE = "trip.exchange";
    public static final String TRIP_QUEUE    = "trip.created.chat.queue";
    public static final String TRIP_KEY      = "trip.created";

    // Listen to trip member join events (from trip service)
    public static final String JOINED_QUEUE  = "trip.joined.chat.queue";
    public static final String JOINED_KEY    = "trip.member.joined";

    @Bean TopicExchange userExchange() { return new TopicExchange(USER_EXCHANGE); }
    @Bean TopicExchange tripExchange() { return new TopicExchange(TRIP_EXCHANGE); }

    @Bean Queue matchedQueue() { return new Queue(MATCHED_QUEUE, true); }
    @Bean Queue tripQueue()    { return new Queue(TRIP_QUEUE,    true); }
    @Bean Queue joinedQueue()  { return new Queue(JOINED_QUEUE,  true); }

    @Bean Binding matchedBinding() { return BindingBuilder.bind(matchedQueue()).to(userExchange()).with(MATCHED_KEY); }
    @Bean Binding tripBinding()    { return BindingBuilder.bind(tripQueue()).to(tripExchange()).with(TRIP_KEY); }
    @Bean Binding joinedBinding()  { return BindingBuilder.bind(joinedQueue()).to(tripExchange()).with(JOINED_KEY); }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory cf) {
        RabbitTemplate t = new RabbitTemplate(cf);
        t.setMessageConverter(messageConverter());
        return t;
    }
}
