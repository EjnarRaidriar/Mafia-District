# Using Docker Compose Replicas with Service Discovery

## Overview

This project uses `docker compose --scale` to create multiple replicas of services while maintaining Service Discovery and Load Balancing functionality.

## How It Works

### 1. Single Service Definition

Instead of defining `task-service-1`, `task-service-2`, `task-service-3` manually, we have ONE definition:

```yaml
task-service:
  build: ../../microservices/task-service
  environment:
    PORT: 8081
    SERVICE_ROUTE: /api/task
    # No SERVICE_INSTANCE_ID - auto-generated from container ID
  networks:
    - shared-net
```

### 2. Scale at Runtime

```bash
docker compose up -d --scale task-service=3 --scale voting-service=3
```

This creates:
- `docker-compose-task-service-1`
- `docker-compose-task-service-2`
- `docker-compose-task-service-3`

Each with a **unique container ID** as its hostname.

### 3. Auto-Registration with Service Discovery

**Task Service (Go):**
```go
hostname, _ := os.Hostname()  // Gets container ID (e.g., "a43ac9e14cb1")
serviceID := fmt.Sprintf("%s-%s", serviceName, hostname[:12])
// Result: "task-service-a43ac9e14cb1"
```

**Voting Service (Python):**
```python
hostname = socket.gethostname()  # Gets container ID
instance_id = f"{service_name}-{hostname[:12]}"
# Result: "voting-service-3f9dfe9f07dd"
```

### 4. Service Discovery Registration

Each replica registers independently:
```json
{
  "id": "task-service-a43ac9e14cb1",
  "target": "http://task-service:8081/api/task",
  "healthy": true
}
```

Docker's internal DNS routes `task-service` to ANY healthy replica.

### 5. Gateway Load Balancing

Gateway queries Service Discovery:
- Gets all healthy instances
- Round-robin distributes requests
- Automatically removes unhealthy instances

## Benefits

| Feature | Manual Instances | Using Replicas |
|---------|-----------------|----------------|
| **YAML Lines** | ~180 (task) | ~55 (task) |
| **Duplication** | High (3x blocks) | Zero |
| **Scaling** | Add service block | Change number |
| **Maintenance** | Update 3 places | Update 1 place |
| **Service Discovery** | ✅ Works | ✅ Works |
| **Load Balancing** | ✅ Works | ✅ Works |
| **Health Monitoring** | ✅ Works | ✅ Works |
| **Individual Ports** | ✅ Exposed | ❌ Not exposed |

## Usage

### Start Services

```bash
cd docker-compose

# Start with 3 replicas (default)
docker compose up -d --scale task-service=3 --scale voting-service=3

# Scale to 5 replicas
docker compose up -d --scale task-service=5 --scale voting-service=5

# Scale down to 2 replicas
docker compose up -d --scale task-service=2 --scale voting-service=2
```

### Check Replicas

```bash
# List running replicas
docker ps | grep task-service
docker ps | grep voting-service

# Check Service Discovery
curl http://localhost:3030/services | jq '.instancesByRoute["/api/task"]'
curl http://localhost:3030/services | jq '.instancesByRoute["/api/voting"]'

# Test through Gateway (load-balanced)
curl http://localhost:3000/api/task/health
curl http://localhost:3000/api/voting/health
```

### Access Logs

All replicas share the same URL through the Gateway:

```bash
# Download logs (Gateway load-balances to any healthy replica)
curl "http://localhost:3000/api/task/logs?format=json"
curl "http://localhost:3000/api/voting/logs?format=json"
```

## Important Notes

### No Individual Port Exposure

When using replicas, individual ports (8101, 8102, 8103) are **not exposed**. This is intentional because:

- Replicas are accessed through the **Gateway** (port 3000)
- Gateway load-balances across all healthy instances
- Service Discovery handles routing

### Unique Instance IDs

Each replica automatically generates a unique ID using its **container ID**:
- `task-service-a43ac9e14cb1`
- `task-service-428c627d63cf`
- `task-service-e848b1b5860e`

### Docker DNS Routing

Docker's internal DNS (`task-service:8081`) routes to **any healthy replica**.
Service Discovery uses this for the target URL.

## Laboratory Requirements

This approach fulfills all laboratory requirements:

### Lab 2
- ✅ Task Manager implementation
- ✅ Concurrent task limits
- ✅ Timeout control

### Lab 3
- ✅ Scale up services (using replicas)
- ✅ Round-Robin load balancer (Gateway)
- ✅ Health monitoring (Service Discovery)
- ✅ Telegram notifications
- ✅ Log download endpoints

## Comparison with Manual Instances

**Manual Approach (Old):**
```yaml
task-service-1:
  environment:
    SERVICE_INSTANCE_ID: task-service-1
  ports:
    - "8101:8081"
    
task-service-2:  # Duplicated
  environment:
    SERVICE_INSTANCE_ID: task-service-2
  ports:
    - "8102:8081"
```

**Replicas Approach (New):**
```yaml
task-service:
  # Single definition
  # Run with: --scale task-service=3
```

```bash
# 70% less YAML
# 100% less duplication
# Same functionality
```

## Troubleshooting

### Replicas not registering with Service Discovery

Check that services are built with the latest code:
```bash
docker compose up -d --build --scale task-service=3
```

### View replica logs

```bash
docker logs docker-compose-task-service-1
docker logs docker-compose-task-service-2
docker logs docker-compose-task-service-3
```

### Check Service Discovery

```bash
# List all registered services
curl http://localhost:3030/services | jq .

# Check specific route
curl http://localhost:3030/services | jq '.instancesByRoute["/api/task"]'
```

## Created: November 2025
## Author: Mafia District Development Team
