# Sequence Diagrams — Core Functions

These cover the five flows that define the product: onboarding a user, the
AI-powered discovery feed, swiping into a match, creating a trip (which seeds
chat), and real-time messaging.

---

## 1. Registration → profile bootstrap → onboarding

A new account is created synchronously; the empty profile is created
asynchronously off a `UserRegisteredEvent`; the onboarding form then fills the
profile, which triggers the user's embedding to be computed.

```mermaid
sequenceDiagram
    autonumber
    actor U as User (browser)
    participant GW as API Gateway
    participant AUTH as auth-service
    participant MQ as RabbitMQ
    participant PROF as profile-service
    participant MATCH as matching-service
    participant EMB as embedding-service

    U->>GW: POST /api/v1/auth/register {email, password}
    GW->>AUTH: register
    AUTH->>AUTH: hash password, persist users_credentials
    AUTH-->>U: 200 + Set-Cookie AUTH_TOKEN (JWT)
    AUTH-)MQ: UserRegisteredEvent(userId, email)
    MQ-)PROF: UserRegisteredEvent
    PROF->>PROF: create empty user_profiles row (id = userId)

    Note over U: Onboarding multi-step form (aggregated)
    U->>GW: PUT /api/v1/profile/me {bio, interests, ...}
    GW->>PROF: update profile (X-User-Id)
    PROF->>PROF: save profile fields + collections
    PROF-)MQ: UserProfileUpdatedEvent(userId)
    MQ-)MATCH: UserProfileUpdatedEvent
    MATCH->>EMB: POST /embed { profile text }
    EMB-->>MATCH: 384-d vector
    MATCH->>MATCH: upsert user_embeddings (pgvector)
```

---

## 2. Discover feed (AI recommendation)

A single request fans out to three services. matching embeds the current user's
profile, finds nearest users by cosine distance in pgvector, then enriches the
result with live profile data and each candidate's open trips.

```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant GW as API Gateway
    participant MATCH as matching-service
    participant EMB as embedding-service
    participant PROF as profile-service
    participant TRIP as trip-service

    U->>GW: GET /api/v1/matching/discover/users
    GW->>MATCH: discover (X-User-Id)
    MATCH->>PROF: Feign: getProfileForMatching(userId)
    PROF-->>MATCH: profile text
    MATCH->>EMB: POST /embed
    EMB-->>MATCH: query vector
    MATCH->>MATCH: pgvector nearest neighbours by cosine distance (LIMIT n)
    MATCH->>PROF: Feign: getBatchProfiles(ids)
    PROF-->>MATCH: profile cards
    MATCH->>TRIP: Feign: getOpenTrips()
    TRIP-->>MATCH: open trips (grouped by creator)
    MATCH-->>U: discover cards (+ each user's open trips)
```

---

## 3. Swipe → mutual match → DM room

A like creates a `PENDING` connection. When the other side likes back, the
connection becomes `MATCHED` and a `UserMatchedEvent` makes chat-service open a
direct-message room for the pair.

```mermaid
sequenceDiagram
    autonumber
    actor A as User A
    actor B as User B
    participant GW as API Gateway
    participant MATCH as matching-service
    participant MQ as RabbitMQ
    participant CHAT as chat-service

    A->>GW: POST /api/v1/matching/swipe {target: B, LIKE}
    GW->>MATCH: swipe (X-User-Id = A)
    MATCH->>MATCH: no reverse like → save connection(A,B, PENDING)
    MATCH-->>A: 200

    B->>GW: POST /api/v1/matching/swipe {target: A, LIKE}
    GW->>MATCH: swipe (X-User-Id = B)
    MATCH->>MATCH: reverse PENDING(A,B) found → set MATCHED
    MATCH-)MQ: UserMatchedEvent(A, B)
    MQ-)CHAT: UserMatchedEvent
    CHAT->>CHAT: create DM chat_room + room_participants(A,B)
    Note over A,B: "It's a match" → DM room now visible to both
```

---

## 4. Trip creation → trip room + auto-shared invite

Creating a trip both indexes it for matching and, in chat, opens a group room
and drops a `TRIP_SHARE` card into every DM the creator already has.

```mermaid
sequenceDiagram
    autonumber
    actor U as Creator
    participant GW as API Gateway
    participant TRIP as trip-service
    participant MQ as RabbitMQ
    participant MATCH as matching-service
    participant EMB as embedding-service
    participant CHAT as chat-service

    U->>GW: POST /api/v1/trips/create {trip + itinerary}
    GW->>TRIP: create (X-User-Id)
    TRIP->>TRIP: persist trips + itineraries + stops
    TRIP-)MQ: TripCreatedEvent(tripId, creatorId, title)
    TRIP-->>U: 201 Created

    MQ-)MATCH: TripCreatedEvent
    MATCH->>EMB: POST /embed (trip text)
    EMB-->>MATCH: trip vector
    MATCH->>MATCH: upsert trip_embeddings

    MQ-)CHAT: TripCreatedEvent
    CHAT->>CHAT: create TRIP chat_room (name = title)
    CHAT->>CHAT: insert TRIP_SHARE message into creator's DM rooms
```

---

## 5. Real-time chat (WebSocket / STOMP) with edit & soft-delete

The browser connects to chat-service directly over a native WebSocket; the JWT
is validated on the STOMP `CONNECT` frame. Messages are broadcast to everyone
subscribed to the room topic. Edits and deletes reuse the same channel.

```mermaid
sequenceDiagram
    autonumber
    actor A as User A
    actor B as User B
    participant CHAT as chat-service
    participant DB as chat_db

    A->>CHAT: WS CONNECT /ws (Authorization: Bearer JWT)
    CHAT->>CHAT: validate JWT → bind Principal(userId)
    A->>CHAT: SUBSCRIBE /topic/room/{roomId}
    B->>CHAT: SUBSCRIBE /topic/room/{roomId}

    A->>CHAT: SEND /app/room/{roomId}/message {content}
    CHAT->>DB: insert chat_messages (TEXT)
    CHAT-->>A: /topic/room/{roomId} NEW_MESSAGE
    CHAT-->>B: /topic/room/{roomId} NEW_MESSAGE

    A->>CHAT: SEND /app/room/{roomId}/message/{id}/edit {content}
    CHAT->>DB: update content + edited_at
    CHAT-->>B: EDIT_MESSAGE (shows "edited")

    A->>CHAT: SEND /app/room/{roomId}/message/{id}/delete
    CHAT->>DB: set deleted_at (soft delete)
    CHAT-->>B: DELETE_MESSAGE (shows "message deleted")
```
