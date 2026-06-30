package com.travelbuddy.authservice.service;

import com.travelbuddy.authservice.entity.AccountStatus;
import com.travelbuddy.authservice.entity.Role;
import com.travelbuddy.authservice.entity.UserCredentials;
import com.travelbuddy.authservice.exception.EmailAlreadyInUseException;
import com.travelbuddy.authservice.repository.UserCredentialsRepository;
import com.travelbuddy.authservice.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/** Unit tests for register/login business rules using mocked collaborators. */
class AuthServiceTest {

    private final UserCredentialsRepository repo = mock(UserCredentialsRepository.class);
    private final PasswordEncoder encoder = mock(PasswordEncoder.class);
    private final JwtUtil jwtUtil = mock(JwtUtil.class);
    private final RabbitTemplate rabbit = mock(RabbitTemplate.class);
    private final AuthService service = new AuthService(repo, encoder, jwtUtil, rabbit);

    @Test
    void registerRejectsDuplicateEmail() {
        when(repo.existsByEmail("a@b.com")).thenReturn(true);
        assertThrows(EmailAlreadyInUseException.class, () -> service.register("a@b.com", "pw"));
        verify(repo, never()).save(any());
    }

    @Test
    void registerHashesPasswordAssignsUserRoleAndPublishesEvent() {
        when(repo.existsByEmail(anyString())).thenReturn(false);
        when(encoder.encode("pw")).thenReturn("hashed");
        when(repo.save(any(UserCredentials.class))).thenAnswer(inv -> {
            UserCredentials u = inv.getArgument(0);
            u.setId(UUID.randomUUID());
            return u;
        });
        when(jwtUtil.generateToken(anyString(), anyString())).thenReturn("jwt");

        String token = service.register("new@b.com", "pw");

        assertEquals("jwt", token);
        ArgumentCaptor<UserCredentials> captor = ArgumentCaptor.forClass(UserCredentials.class);
        verify(repo).save(captor.capture());
        assertEquals("hashed", captor.getValue().getPasswordHash());
        assertEquals(Role.USER, captor.getValue().getRole());
        assertEquals(AccountStatus.ACTIVE, captor.getValue().getAccountStatus());
        verify(rabbit).convertAndSend(anyString(), anyString(), any(Object.class));
    }

    @Test
    void loginRejectsUnknownUser() {
        when(repo.findByEmail("x@b.com")).thenReturn(Optional.empty());
        assertThrows(BadCredentialsException.class, () -> service.login("x@b.com", "pw"));
    }

    @Test
    void loginRejectsWrongPassword() {
        UserCredentials u = new UserCredentials();
        u.setPasswordHash("hashed");
        when(repo.findByEmail("a@b.com")).thenReturn(Optional.of(u));
        when(encoder.matches("wrong", "hashed")).thenReturn(false);
        assertThrows(BadCredentialsException.class, () -> service.login("a@b.com", "wrong"));
    }

    @Test
    void loginRejectsBannedAccount() {
        UserCredentials u = new UserCredentials();
        u.setPasswordHash("hashed");
        u.setAccountStatus(AccountStatus.BANNED);
        when(repo.findByEmail("a@b.com")).thenReturn(Optional.of(u));
        when(encoder.matches("pw", "hashed")).thenReturn(true);
        assertThrows(DisabledException.class, () -> service.login("a@b.com", "pw"));
    }

    @Test
    void loginReturnsTokenForValidActiveUser() {
        UserCredentials u = new UserCredentials();
        u.setId(UUID.randomUUID());
        u.setPasswordHash("hashed");
        u.setAccountStatus(AccountStatus.ACTIVE);
        u.setRole(Role.USER);
        when(repo.findByEmail("a@b.com")).thenReturn(Optional.of(u));
        when(encoder.matches("pw", "hashed")).thenReturn(true);
        when(jwtUtil.generateToken(anyString(), anyString())).thenReturn("jwt");
        assertEquals("jwt", service.login("a@b.com", "pw"));
    }
}
