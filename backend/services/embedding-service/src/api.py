import logging
import time

from fastapi import FastAPI, Request
from starlette.responses import Response
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
from sentence_transformers import SentenceTransformer

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s - %(message)s",
)
logger = logging.getLogger("embedding.http")

app = FastAPI()
model = SentenceTransformer("all-MiniLM-L6-v2")

MAX_BODY = 2000

REQUESTS = Counter(
    "embedding_http_requests_total", "Total HTTP requests", ["method", "path", "status"]
)
LATENCY = Histogram(
    "embedding_http_request_duration_seconds", "HTTP request latency", ["method", "path"]
)


@app.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log the full inbound HTTP request/response and record Prometheus metrics."""
    if request.url.path == "/metrics":
        return await call_next(request)

    req_body = await request.body()
    line = f"{request.method} {request.url.path}"
    headers = ", ".join(f"{k}={v}" for k, v in request.headers.items())
    logger.info("IN  %s  headers=[%s]", line, headers)
    if req_body:
        logger.info("IN  %s  body=%s", line, req_body[:MAX_BODY].decode("utf-8", "replace"))

    start = time.perf_counter()
    response = await call_next(request)
    took = time.perf_counter() - start

    REQUESTS.labels(request.method, request.url.path, str(response.status_code)).inc()
    LATENCY.labels(request.method, request.url.path).observe(took)

    chunks = [section async for section in response.body_iterator]
    res_body = b"".join(chunks)
    logger.info("OUT %s  status=%s (%d ms)", line, response.status_code, int(took * 1000))
    if res_body:
        logger.info("OUT %s  body=%s", line, res_body[:MAX_BODY].decode("utf-8", "replace"))

    return Response(
        content=res_body,
        status_code=response.status_code,
        headers=dict(response.headers),
        media_type=response.media_type,
    )


@app.post("/embed")
def embed(payload: dict):
    text = payload["text"]
    vector = model.encode(text).tolist()
    return {"embedding": vector}
