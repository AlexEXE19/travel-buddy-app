# System Architecture

TravelBuddy is a **microservice** system. A Next.js frontend talks to a single
**API Gateway**, which authenticates each request (validates the JWT cookie and
injects an `X-User-Id` header) and routes it to the owning service. Services are
loosely coupled: they call each other **synchronously** over HTTP (OpenFeign)
only where a request needs live data, and communicate **asynchronously** through
**RabbitMQ** events for everything else. Every service owns its **own database**
(database-per-service); there are no shared tables.

```mermaid
flowchart TB
    subgraph client["Client"]
        FE["Next.js Frontend<br/>(browser · :3000)"]
    end

    subgraph edge["Edge"]
        GW["API Gateway<br/>Spring Cloud Gateway · :8080<br/>JWT validation → X-User-Id"]
    end

    FE -->|"REST (cookie JWT)"| GW
    FE -.->|"STOMP / WebSocket (JWT)"| CHAT

    subgraph svc["Application services"]
        AUTH["auth-service<br/>:8081"]
        PROF["profile-service<br/>:8082"]
        TRIP["trip-service<br/>:8083"]
        MATCH["matching-service<br/>:8084"]
        EMB["embedding-service<br/>FastAPI · :8085"]
        CHAT["chat-service<br/>:8086"]
    end

    GW --> AUTH
    GW --> PROF
    GW --> TRIP
    GW --> MATCH
    GW --> CHAT

    %% Synchronous inter-service calls (OpenFeign)
    MATCH -->|"Feign: batch profiles"| PROF
    MATCH -->|"Feign: open trips"| TRIP
    MATCH -->|"Feign: embed text"| EMB
    CHAT  -->|"Feign: my trips (room backfill)"| TRIP

    subgraph data["Datastores (one per service)"]
        DBA[("auth_db<br/>PostgreSQL")]
        DBP[("profile_db<br/>PostgreSQL")]
        DBT[("trip_db<br/>PostgreSQL")]
        DBM[("matching_db<br/>PostgreSQL + pgvector")]
        DBC[("chat_db<br/>PostgreSQL")]
    end

    AUTH --> DBA
    PROF --> DBP
    TRIP --> DBT
    MATCH --> DBM
    CHAT --> DBC

    subgraph bus["Event bus"]
        MQ{{"RabbitMQ<br/>(topic exchanges)"}}
    end

    AUTH  -.->|"UserRegisteredEvent"| MQ
    PROF  -.->|"UserProfileUpdatedEvent"| MQ
    TRIP  -.->|"TripCreatedEvent / UserJoinedTripEvent"| MQ
    MATCH -.->|"UserMatchedEvent"| MQ

    MQ -.->|"UserRegisteredEvent"| PROF
    MQ -.->|"profile / trip events"| MATCH
    MQ -.->|"matched / trip events"| CHAT
```

## Communication styles

| Style | Mechanism | Examples |
|-------|-----------|----------|
| **Client → system** | REST over the gateway; JWT in an `AUTH_TOKEN` cookie | every page/action |
| **Real-time** | Native WebSocket + STOMP, browser → chat-service directly | live chat messages |
| **Synchronous service → service** | Spring Cloud OpenFeign (HTTP) | matching → profile/trip/embedding, chat → trip |
| **Asynchronous service → service** | RabbitMQ topic exchanges | registration, profile/trip changes, matches |

## Event catalogue (RabbitMQ)

| Event | Published by | Consumed by | Effect |
|-------|--------------|-------------|--------|
| `UserRegisteredEvent` | auth-service | profile-service | create an empty profile for the new user |
| `UserProfileUpdatedEvent` | profile-service | matching-service | (re)compute the user's 384-d embedding |
| `TripCreatedEvent` | trip-service | matching-service, chat-service | embed the trip; create a trip chat room + share cards |
| `UserJoinedTripEvent` | trip-service | chat-service | add the user to that trip's chat room |
| `UserMatchedEvent` | matching-service | chat-service | create a direct-message room for the matched pair |
