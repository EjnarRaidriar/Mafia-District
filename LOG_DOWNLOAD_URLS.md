# Log Download URLs - Quick Reference

## Task Service

### Direct Access to Replicas

```bash
# Replica 1
curl "http://localhost:8101/api/task/logs?format=json" -o task-logs-1.json
curl "http://localhost:8101/api/task/logs?format=text" -o task-logs-1.txt

# Replica 2
curl "http://localhost:8102/api/task/logs?format=json" -o task-logs-2.json

# Replica 3
curl "http://localhost:8103/api/task/logs?format=json" -o task-logs-3.json
```

### Through Gateway (Load-Balanced)

```bash
curl "http://localhost:3000/api/task/logs?format=json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Voting Service

### Direct Access to Replicas

```bash
# Replica 1
curl "http://localhost:8071/api/voting/logs?format=json" -o voting-logs-1.json
curl "http://localhost:8071/api/voting/logs?format=text" -o voting-logs-1.txt

# Replica 2
curl "http://localhost:8072/api/voting/logs?format=json" -o voting-logs-2.json

# Replica 3
curl "http://localhost:8073/api/voting/logs?format=json" -o voting-logs-3.json
```

### Through Gateway (Load-Balanced)

```bash
curl "http://localhost:3000/api/voting/logs?format=json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Query Parameters

Both services support:

- `format` — `json` (default) or `text`
- `level` — Filter by log level
  - Task: `INFO`, `WARN`, `ERROR`
  - Voting: `DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`
- `since` — ISO 8601 timestamp (e.g., `2025-11-23T10:00:00Z`)
- `until` — ISO 8601 timestamp

### Examples

```bash
# Get ERROR logs only
curl "http://localhost:8101/api/task/logs?format=text&level=ERROR"

# Get logs from last hour
curl "http://localhost:8071/api/voting/logs?since=2025-11-23T10:00:00Z"

# Download with filters
curl "http://localhost:8102/api/task/logs?format=json&level=WARN" -o warnings.json
```

---

## Service Discovery

Check all registered instances:

```bash
# All services
curl http://localhost:3030/services | jq .

# Task service instances
curl http://localhost:3030/services | jq '.instancesByRoute["/api/task"]'

# Voting service instances
curl http://localhost:3030/services | jq '.instancesByRoute["/api/voting"]'
```

---

## Port Mapping

| Service | Replica | Port | URL |
|---------|---------|------|-----|
| **Task Service** | 1 | 8101 | http://localhost:8101/api/task/logs |
| **Task Service** | 2 | 8102 | http://localhost:8102/api/task/logs |
| **Task Service** | 3 | 8103 | http://localhost:8103/api/task/logs |
| **Voting Service** | 1 | 8071 | http://localhost:8071/api/voting/logs |
| **Voting Service** | 2 | 8072 | http://localhost:8072/api/voting/logs |
| **Voting Service** | 3 | 8073 | http://localhost:8073/api/voting/logs |
| **Gateway** | - | 3000 | http://localhost:3000/api/{service}/logs |

---

## Created: November 2025
