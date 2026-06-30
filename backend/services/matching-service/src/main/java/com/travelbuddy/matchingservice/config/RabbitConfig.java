package com.travelbuddy.matchingservice.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    public static final String QUEUE = "trip.queue";
    public static final String EXCHANGE = "trip.exchange";
    public static final String ROUTING_KEY = "trip.created";

    // Profile update events (from profile service)
    public static final String PROFILE_UPDATED_QUEUE = "profile.updated.matching.queue";
    public static final String USER_EXCHANGE = "user.exchange";
    public static final String PROFILE_UPDATED_ROUTING_KEY = "profile.updated";

    // User matched events (published by matching service)
    public static final String USER_MATCHED_ROUTING_KEY = "user.matched";

    @Bean
    public Queue queue() {
        return new Queue(QUEUE, true);
    }

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Binding binding() {
        return BindingBuilder
                .bind(queue())
                .to(exchange())
                .with(ROUTING_KEY);
    }

    @Bean
    public Queue profileUpdatedQueue() {
        return new Queue(PROFILE_UPDATED_QUEUE, true);
    }

    @Bean
    public TopicExchange userExchange() {
        return new TopicExchange(USER_EXCHANGE);
    }

    @Bean
    public Binding profileUpdatedBinding() {
        return BindingBuilder
                .bind(profileUpdatedQueue())
                .to(userExchange())
                .with(PROFILE_UPDATED_ROUTING_KEY);
    }


    @Bean
    public MessageConverter messageConverter() {
        return new JacksonJsonMessageConverter();
    }

    @Bean
    public AmqpTemplate amqpTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }
}