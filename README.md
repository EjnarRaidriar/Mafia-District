# Main branch

| Service           | Protocol   | Format | Direction         | Notes                           |
| ----------------- | ---------- | ------ | ----------------- | ------------------------------- |
| User Service      | REST       | JSON   | Internal + Public | Authenticates and tracks users  |
| Game Service      | REST/Event | JSON   | Internal          | Coordinates gameplay state      |
| Shop Service      | REST       | JSON   | Internal          | Manages purchases and inventory |
| Roleplay Service  | REST/gRPC  | JSON   | Internal          | Executes role actions           |
| Town Service      | REST       | JSON   | Internal          | Tracks player movement          |
| Task Service      | REST/Event | JSON   | Internal          | Assigns and verifies tasks      |
| Voting Service    | REST/Event | JSON   | Internal          | Voting flow during night phase  |
| Rumors Service    | REST       | JSON   | Internal          | Distributes purchased rumors    |
| Character Service | REST       | JSON   | Internal          | Handles player customization    |
| Communication Svc | REST       | JSON   | Internal/Public   | In-game chat and messaging      |

## Data Storage Strategy

Each service owns and manages its **own isolated database** to support:

- **Loose coupling**: Services don’t directly access each other’s databases.
- **Autonomy**: Each team can independently scale, migrate, or version their DB.
- **Security**: Only the owning service can read/write its data.

### Data Access Between Services

- Services **never directly query** other service databases.
- All access is **via APIs or events**.

## Unified API Schema & Data Formats

All APIs use **REST + JSON**, with a common response schema:

### Successful Response Format

`{   "status": "success",   "data": {     "result": "..."   } }`

### Error Response Format

`{   "status": "error",   "error": {     "code": "INVALID_INPUT",     "message": "User ID must be a valid UUID"   } }`
