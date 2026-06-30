# TravelBuddy — Architecture & Design Diagrams

Diagrams for the TravelBuddy microservice system, written in **Mermaid** so they
render directly on GitHub, in VS Code (Markdown preview), and in most thesis
tooling. Edit the fenced ```` ```mermaid ```` blocks to update them.

| # | File | Contents |
|---|------|----------|
| 1 | [01-system-architecture.md](01-system-architecture.md) | Component/architecture diagram, communication styles, RabbitMQ event catalogue |
| 2 | [02-er-diagrams.md](02-er-diagrams.md) | ER diagram per database (auth, profile, trip, matching, chat) + the logical cross-service links |
| 3 | [03-sequence-diagrams.md](03-sequence-diagrams.md) | Sequence diagrams for the five core functions (onboarding, discovery, match, trip+chat, real-time chat) |
| 4 | [04-observability.md](04-observability.md) | Logs/metrics/traces pipeline and an end-to-end trace |
| 5 | [05-deployment.md](05-deployment.md) | Docker Compose container topology, networks, published ports, volumes |
| 6 | [06-state-diagrams.md](06-state-diagrams.md) | State machines for the connection lifecycle and the trip lifecycle |

## Key design facts the diagrams reflect

- **Microservices** behind a single **API Gateway** that validates the JWT and
  injects `X-User-Id`.
- **Database-per-service**: five isolated PostgreSQL databases, **no foreign
  keys across services**; schemas are linked only logically by the shared
  **user id** and **trip id**.
- **matching_db** uses the **pgvector** extension for 384-dimension embedding
  similarity search.
- **Synchronous** inter-service calls use **OpenFeign**; **asynchronous**
  integration uses **RabbitMQ** events.
- **chat-service** serves a **native WebSocket/STOMP** endpoint the browser
  connects to directly.
- Full **observability** (Grafana + Loki + Tempo + Prometheus) with distributed
  tracing correlated to logs.

## Rendering / exporting

- **VS Code**: open any file and use *Markdown: Open Preview* (the built-in
  preview renders Mermaid; the *Markdown Preview Mermaid Support* extension helps
  on older versions).
- **PNG/SVG for the thesis**: paste a block into <https://mermaid.live>, or use
  the CLI:
  ```bash
  npx @mermaid-js/mermaid-cli -i 01-system-architecture.md -o architecture.svg
  ```
