package com.travelbuddy.profileservice.events;

import com.travelbuddy.profileservice.config.RabbitConfig;
import com.travelbuddy.profileservice.entity.UserProfile;
import com.travelbuddy.profileservice.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserEventListener {
    private final UserProfileRepository userProfileRepository;

    @RabbitListener(queues = RabbitConfig.QUEUE)
    public void handleUserRegistered(UserRegisteredEvent event) {
        UserProfile userProfile = new UserProfile();
        userProfile.setId(event.userId());
        userProfile.setVerified(false); // new accounts start unverified; an admin verifies them
        userProfileRepository.save(userProfile);
    }
}
