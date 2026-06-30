# Deployment / Container Topology

Everything runs as containers in one **Docker Compose** project on two bridge
networks: **`frontend-net`** (the only network exposed toward the user) and
**`backend-net`** (internal services, databases, broker, observability). The
**api-gateway** is attached to *both* networks and is the single ingress for the
application API. Each stateful container has a named volume.

```mermaid
flowchart TB
    Browser(["User's browser"])

    subgraph compose["Docker Compose project: travel-buddy-app"]
        subgraph fnet["network: frontend-net"]
            FE["frontend<br/>Next.js · :3000"]
            GW["api-gateway<br/>Spring Cloud Gateway · :8080<br/>(also on backend-net)"]
        end

        subgraph bnet["network: backend-net"]
            AUTH["auth-service · :8081"]
            PROF["profile-service · :8082"]
            TRIP["trip-service · :8083"]
            MATCH["matching-service · :8084"]
            EMB["embedding-service<br/>FastAPI · :8085"]
            CHAT["chat-service · :8086"]
            MQ{{"rabbitmq<br/>:5672 · UI :15672"}}

            subgraph dbs["PostgreSQL — one per service"]
                DBA[("postgres-auth")]
                DBP[("postgres-profile")]
                DBT[("postgres-trip")]
                DBM[("postgres-matching<br/>pgvector")]
                DBC[("postgres-chat")]
            end

            subgraph obs["Observability stack"]
                PROM["prometheus · :9090"]
                LOKI["loki"]
                TEMPO["tempo"]
                PTAIL["promtail"]
                GRAF["grafana · :3001"]
            end
        end
    end

    %% What the browser reaches directly (published ports)
    Browser -->|":3000"| FE
    Browser -->|":8086 WebSocket"| CHAT
    Browser -->|":3001"| GRAF

    %% Server-side / internal
    FE -->|"SSR REST :8080"| GW
    GW --> AUTH
    GW --> PROF
    GW --> TRIP
    GW --> MATCH
    GW --> CHAT

    MATCH --> EMB
    AUTH --> DBA
    PROF --> DBP
    TRIP --> DBT
    MATCH --> DBM
    CHAT --> DBC

    AUTH --- MQ
    PROF --- MQ
    TRIP --- MQ
    MATCH --- MQ
    CHAT --- MQ

    GRAF --> PROM
    GRAF --> LOKI
    GRAF --> TEMPO
```

> Only `frontend`, `chat-service` (WebSocket), and the ops UIs (`grafana`,
> `prometheus`) are meant to be reached **directly** from the browser. All
> application REST traffic goes **browser → frontend (SSR) → api-gateway →
> service**; the browser never calls the gateway or internal services directly.

## Published ports (host → container)

| Host port | Container | Purpose |
|-----------|-----------|---------|
| 3000 | frontend | web app |
| 8080 | api-gateway | application API ingress |
| 8081–8086 | auth / profile / trip / matching / embedding / chat | per-service (dev access) |
| 5672 / 15672 | rabbitmq | AMQP / management UI |
| 9090 | prometheus | metrics UI |
| 3001 | grafana | dashboards (logs + metrics + traces) |

## Named volumes (persistent state)

| Volume | Container | Holds |
|--------|-----------|-------|
| `postgres_auth_data` | postgres-auth | credentials |
| `postgres_profile_data` | postgres-profile | profiles |
| `postgres_trip_data` | postgres-trip | trips & itineraries |
| `postgres_matching_data` | postgres-matching | embeddings & connections |
| `postgres_chat_data` | postgres-chat | rooms & messages |
| `rabbitmq_data` | rabbitmq | broker state |

> Observability containers (Loki/Tempo/Prometheus/Grafana) use **ephemeral**
> storage and **read-only bind-mounts** for their config under
> `observability/` — so dashboards/datasources are provisioned as code, while
> stored logs/metrics/traces reset if the containers are removed.

## Image origin

- **Built from source** (Dockerfiles in `backend/services/*`, `frontend/`):
  the 6 Spring services, the FastAPI embedding service, the gateway, the frontend.
- **Off-the-shelf images**: `postgres:16`, `pgvector/pgvector:pg16`,
  `rabbitmq:3-management`, `grafana/loki`, `grafana/tempo`, `grafana/promtail`,
  `grafana/grafana`, `prom/prometheus`.
