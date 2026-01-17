# Docker Deployment Guide

## Quick Start

### 1. Build and Run with Docker Compose (Recommended)

```bash
# Create .env file with your configuration
cat > .env << EOF
WEBHOOK_PORT=3000
WEBHOOK_PATH=/webhook
VERIFY_TOKEN=your-verify-token
FORWARD_WEBHOOK_URL=http://your-webhook-url.com/webhook
LOG_LEVEL=info
EOF

# Start the container
docker-compose up -d

# View logs
docker-compose logs -f whatsapp-bot

# Stop the container
docker-compose down
```

### 2. Build and Run Manually

```bash
# Build image
docker build -t whatsapp-bot:latest .

# Run container
docker run -d \
  --name whatsapp-bot \
  -p 3000:3000 \
  -e WEBHOOK_PORT=3000 \
  -e VERIFY_TOKEN=your-verify-token \
  -e FORWARD_WEBHOOK_URL=http://your-webhook.com/webhook \
  -v whatsapp_auth:/app/.wwebjs_auth \
  -v $(pwd)/logs:/app/logs \
  whatsapp-bot:latest

# View logs
docker logs -f whatsapp-bot

# Stop container
docker stop whatsapp-bot
docker rm whatsapp-bot
```

---

## Configuration

### Environment Variables

Set these in `docker-compose.yml` or `.env`:

```yaml
WEBHOOK_PORT=3000              # Port the app runs on
WEBHOOK_PATH=/webhook          # Webhook endpoint path
VERIFY_TOKEN=your-token        # Webhook verification token
FORWARD_WEBHOOK_URL=           # URL to forward messages to
LOG_LEVEL=info                 # Logging level (debug, info, warn, error)
NODE_ENV=production            # Node environment
```

### Volumes

**`whatsapp_auth` volume** - Persists WhatsApp authentication:
- Stores session tokens
- Prevents re-authentication on restart
- Survives container restarts

**`logs` volume** - Persists application logs:
- Container logs stored locally
- Useful for debugging

---

## Common Commands

### View Logs
```bash
# Real-time logs
docker-compose logs -f whatsapp-bot

# Last 100 lines
docker-compose logs --tail 100 whatsapp-bot

# Last 1 hour of logs
docker-compose logs --since 1h whatsapp-bot
```

### Execute Commands Inside Container
```bash
# Interactive shell
docker-compose exec whatsapp-bot sh

# Run a command
docker-compose exec whatsapp-bot node -v

# View auth files
docker-compose exec whatsapp-bot ls -la .wwebjs_auth
```

### Restart Container
```bash
docker-compose restart whatsapp-bot

# Or with full rebuild
docker-compose down
docker-compose up -d --build
```

### View Resource Usage
```bash
docker stats whatsapp-bot
```

### Check Container Status
```bash
docker-compose ps

# Detailed info
docker inspect whatsapp-bot
```

---

## Accessing the API

### From Host Machine
```bash
# Get QR code
curl http://localhost:3000/qr

# Health check
curl http://localhost:3000/health

# Send message
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "919876543210", "message": "Hello!"}'
```

### From Another Container
```bash
# Use container name as hostname
curl http://whatsapp-bot:3000/health

# Example in docker-compose
services:
  my-app:
    image: my-app:latest
    environment:
      - WHATSAPP_API_URL=http://whatsapp-bot:3000
```

---

## Getting QR Code

Since the container runs without display, use the API:

```bash
# Get QR code as JSON
curl http://localhost:3000/qr

# Response:
# {
#   "success": true,
#   "qrCode": "00020236000101290060hkm5160010A000070070012hk.IWMC..."
# }

# Generate image from QR code string using online tools or:
# - Use qrcode.react library
# - Use qrencode: echo "QR_STRING" | qrencode -o qr.png
```

---

## Webhook Forwarding

To receive messages on a webhook URL:

### Using webhook.site (Testing)
```bash
# Set in environment
FORWARD_WEBHOOK_URL=https://webhook.site/your-unique-id

# View messages at https://webhook.site
```

### Using ngrok (Local Development)
```bash
# Start ngrok
ngrok http 3000

# Set in environment
FORWARD_WEBHOOK_URL=https://your-ngrok-url.ngrok.io/webhook

# Your app will forward messages there
```

### Using Your Server
```bash
# Set your server URL
FORWARD_WEBHOOK_URL=https://your-api.example.com/webhook

# Ensure /webhook endpoint exists and handles POST requests
```

---

## Production Deployment

### Docker Hub

```bash
# Login
docker login

# Tag image
docker tag whatsapp-bot:latest username/whatsapp-bot:latest

# Push
docker push username/whatsapp-bot:latest

# Pull on production server
docker pull username/whatsapp-bot:latest
docker run -d --name whatsapp-bot username/whatsapp-bot:latest
```

### Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy service
docker service create \
  --name whatsapp-bot \
  --publish 3000:3000 \
  -e WEBHOOK_PORT=3000 \
  -e FORWARD_WEBHOOK_URL=https://your-api.com/webhook \
  --mount type=volume,source=whatsapp_auth,target=/app/.wwebjs_auth \
  whatsapp-bot:latest
```

### Kubernetes

```bash
# Create namespace
kubectl create namespace whatsapp

# Create ConfigMap for config
kubectl create configmap whatsapp-config \
  --from-literal=WEBHOOK_PORT=3000 \
  --from-literal=FORWARD_WEBHOOK_URL=https://your-api.com/webhook \
  -n whatsapp

# Create secret for sensitive data
kubectl create secret generic whatsapp-secrets \
  --from-literal=VERIFY_TOKEN=your-token \
  -n whatsapp

# Deploy using helm or kubectl manifest
```

---

## Troubleshooting

### Container Won't Start
```bash
# Check logs
docker-compose logs whatsapp-bot

# Check image exists
docker images

# Rebuild image
docker-compose build --no-cache
docker-compose up -d
```

### Health Check Failing
```bash
# Manual health check
curl -v http://localhost:3000/health

# Check container logs
docker-compose logs whatsapp-bot

# Exec into container
docker-compose exec whatsapp-bot curl http://localhost:3000/health
```

### Authentication Not Working
```bash
# Clear auth volume
docker-compose down -v

# Rebuild and restart
docker-compose up -d

# Check logs for QR code
docker-compose logs whatsapp-bot | grep "QR"
```

### Out of Memory
```bash
# Check resource usage
docker stats whatsapp-bot

# Increase limits in docker-compose.yml
# Or restart container to free memory
docker-compose restart whatsapp-bot
```

---

## Performance Tips

1. **Use Alpine Image** (if you want smaller size):
   ```dockerfile
   FROM node:18-alpine
   ```

2. **Multi-stage Build** (reduce image size):
   ```dockerfile
   FROM node:18 as builder
   # ... build steps
   FROM node:18-slim
   COPY --from=builder /app /app
   ```

3. **Resource Limits** - Already set in docker-compose.yml

4. **Logging** - Adjust log level to reduce I/O:
   ```yaml
   LOG_LEVEL: error  # Only errors
   ```

---

## Security

1. **Environment Variables**: Keep secrets in `.env` (don't commit)
2. **Token**: Use strong `VERIFY_TOKEN`
3. **Network**: Use private networks in production
4. **Images**: Scan for vulnerabilities:
   ```bash
   docker scan whatsapp-bot:latest
   ```

---

## Monitoring

### Using Prometheus + Grafana

```yaml
# Add monitoring service to docker-compose.yml
services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"
```

### Using ELK Stack (Elasticsearch, Logstash, Kibana)

```yaml
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.14.0
    environment:
      - discovery.type=single-node
    ports:
      - "9200:9200"
  
  kibana:
    image: docker.elastic.co/kibana/kibana:7.14.0
    ports:
      - "5601:5601"
```

---

## Backup & Restore

### Backup Auth Session
```bash
# Backup volume
docker run --rm -v whatsapp_auth:/data -v $(pwd):/backup \
  alpine tar czf /backup/whatsapp_auth_backup.tar.gz -C /data .

# Restore volume
docker run --rm -v whatsapp_auth:/data -v $(pwd):/backup \
  alpine tar xzf /backup/whatsapp_auth_backup.tar.gz -C /data
```

### Export Container
```bash
# Save image
docker save whatsapp-bot:latest -o whatsapp-bot.tar.gz

# Load image on another machine
docker load -i whatsapp-bot.tar.gz
```

---

## Useful Docker Commands

```bash
# Clean up unused resources
docker system prune -a

# View image layers
docker history whatsapp-bot:latest

# Run temporary container for testing
docker run -it --rm whatsapp-bot:latest sh

# Get container IP
docker inspect whatsapp-bot | grep IPAddress
```
