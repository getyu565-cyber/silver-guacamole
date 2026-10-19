# Stage 1: Temporary downloader stage
FROM ollama/ollama:latest AS downloader

# Install curl for server readiness checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy your host's local Ollama credentials and configuration state
COPY ~/.ollama /root/.ollama

# Start server in background, wait for it to listen, run signin, and pull model
RUN ( ollama serve & ) && \
    until curl -s http://localhost:11434/api/tags; do sleep 1; done && \
    ollama signin && \
    ollama pull llama3.2

# Stage 2: Final lightweight image
FROM ollama/ollama:latest

# Transfer the authenticated session state and pre-pulled model from Stage 1
COPY --from=downloader /root/.ollama /root/.ollama

EXPOSE 11434
