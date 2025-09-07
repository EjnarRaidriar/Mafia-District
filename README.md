# Main branch

| Service               | Protocol | Format | Direction         | Notes                           | Database    |
| --------------------- | -------- | ------ | ----------------- | ------------------------------- | ----------- |
| **User Service**      | REST     | JSON   | Internal + Public | Authenticates and tracks users  | ✔️ Separate |
| **Game Service**      | REST     | JSON   | Internal + Public | Coordinates gameplay state      | ✔️ Separate |
| **Shop Service**      | REST     | JSON   | Internal + Public | Manages purchases and inventory | ✔️ Separate |
| **Roleplay Service**  | REST     | JSON   | Internal          | Executes role actions           | ✔️ Separate |
| **Town Service**      | REST     | JSON   | Internal + Public | Tracks player movement          | ✔️ Separate |
| **Task Service**      | REST     | JSON   | Internal + Public | Assigns and verifies tasks      | ✔️ Separate |
| **Voting Service**    | REST     | JSON   | Internal + Public | Voting flow during night phase  | ✔️ Separate |
| **Rumors Service**    | REST     | JSON   | Internal + Public | Distributes purchased rumors    | ✔️ Separate |
| **Character Service** | REST     | JSON   | Internal + Public | Handles player customization    | ✔️ Separate |
| **Communication Svc** | REST     | JSON   | Internal + Public | In-game chat and messaging      | ✔️ Separate |

## Data Storage Strategy

Each service owns and manages its **own isolated database** to support:

- **Loose coupling**: Services don’t directly access each other’s databases.
- **Autonomy**: Each team can independently scale, migrate, or version their DB.
- **Security**: Only the owning service can read/write its data.

### Data Access Between Services

- Services **never directly query** other service databases.
- All access is **via APIs (REST, gRPC) or events (RabbitMQ)**.

## Unified API Schema & Data Formats

All REST APIs use **JSON** with a common response schema:

### Successful Response Format

```json
{
  "status": "success",
  "data": { "result": "..." }
}
```

```json
{
  "status": "error",
  "error": {
    "code": "INVALID_INPUT",
    "message": "User ID must be a valid UUID"
  }
}
```

gRPC APIs (Roleplay Service) use Protocol Buffers for high-performance communication.

### Versioning

- Follows Semantic Versioning (MAJOR.MINOR.PATCH).
- Tag releases in main (e.g., v1.0.0).
- Maintain CHANGELOG.md per service.
