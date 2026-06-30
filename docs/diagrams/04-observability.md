# Observability Architecture

Every service emits the **three pillars** — logs, metrics, traces — which are
collected by a Grafana stack (Loki, Prometheus, Tempo) and explored through a
single Grafana UI. The pillars are correlated by **trace id**: a log line links
to its trace, and a span links back to its logs.

```mermaid
flowchart LR
    subgraph services["Application services (×7)"]
        S["auth · profile · trip · matching · chat · gateway<br/>(+ embedding, FastAPI)"]
    end

    subgraph collect["Collection"]
        PT["Promtail<br/>(reads container stdout)"]
        PR["Prometheus<br/>(scrapes /actuator/prometheus, /metrics)"]
    end

    subgraph store["Stores"]
        LK[("Loki<br/>logs")]
        TM[("Tempo<br/>traces")]
        PM[("Prometheus TSDB<br/>metrics")]
    end

    GRAF["Grafana :3001<br/>dashboards · Explore · drilldowns"]

    %% logs
    S -.->|"stdout (JSON-ish lines)"| PT --> LK
    %% metrics
    PR -->|"scrape every 15s"| S
    PR --> PM
    %% traces
    S ==>|"spans (Zipkin format, W3C traceparent)"| TM

    LK --> GRAF
    TM --> GRAF
    PM --> GRAF

    LK -.->|"trace id → open trace"| TM
    TM -.->|"span → open logs"| LK
```

## Pillars

| Pillar | Emitted by service | Transport | Stored in | Seen in Grafana |
|--------|--------------------|-----------|-----------|-----------------|
| **Logs** | SLF4J `HttpLoggingFilter` (full req/resp), Feign FULL logging | container stdout → Promtail | Loki | Explore → Loki, labelled `{service=...}` |
| **Metrics** | Micrometer → `/actuator/prometheus`; FastAPI `/metrics` | Prometheus scrape | Prometheus | "Service Overview" dashboard |
| **Traces** | Micrometer Tracing + OpenFeign propagation | Zipkin format → Tempo | Tempo | Explore → Tempo (TraceQL) |

## End-to-end trace example

A discover request produces **one** trace spanning the gateway and three
downstream services (the trace id is propagated as a W3C `traceparent` header,
including across the OpenFeign calls):

```mermaid
flowchart TB
    G["api-gateway<br/>http get /discover<br/>SERVER + CLIENT spans"]
    M["matching-service<br/>SERVER span + Feign CLIENT spans"]
    P["profile-service<br/>SERVER span (getBatchProfiles)"]
    T["trip-service<br/>SERVER span (getOpenTrips)"]
    E["embedding-service<br/>(client span only — no Python tracing)"]

    G --> M
    M --> P
    M --> T
    M -.-> E
```
