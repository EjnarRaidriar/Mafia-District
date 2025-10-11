# Mafia District - Updated Architecture

## Overview
This document describes the updated architecture of the Mafia District microservices system, including all newly implemented features and components.

## New Features Implemented

### 1. Redis Caching System
- **Location**: Gateway Service
- **Purpose**: Cache frequently accessed GET requests and authentication data
- **Components**:
  - `CacheService` - Redis connection and operations
  - `cacheMiddleware` - GET request caching
  - `authCacheMiddleware` - Authentication token caching
  - `cacheInvalidationMiddleware` - Cache invalidation on data changes

### 2. WebSocket Real-time Communication
- **Game Service**: WebSocket server for client connections
- **Roleplay Service**: WebSocket broadcasting for real-time events
- **Integration**: Game Service connects to Roleplay Service WebSocket for live updates
- **Features**:
  - Real-time action broadcasting
  - Live game state updates
  - Client-server WebSocket communication

### 3. Task Management & Concurrency Control
- **Gateway Service**: Task limiter middleware with concurrent request control
- **Task Service**: Go-based task manager with timeout and priority queue
- **Voting Service**: Python-based task manager with ThreadPoolExecutor
- **Features**:
  - Concurrent task limits
  - Task timeouts
  - Priority-based task queuing
  - Graceful shutdown handling

### 4. JWT Authentication System
- **Gateway Service**: Centralized authentication
- **Features**:
  - User token generation and validation
  - Service-to-service authentication
  - Token caching for performance
  - Role-based access control

### 5. CI/CD Pipeline
- **GitHub Actions**: Automated build and deployment
- **Docker Hub**: Container registry with version tagging
- **Services Covered**:
  - Gateway Service
  - Task Service
  - Voting Service
  - Game Service
- **Features**:
  - Automatic builds on push to main
  - Version tagging (YYYY.MM.DD-commitHash)
  - Multi-platform builds (linux/amd64, linux/arm64)
  - Docker Hub integration

## Architecture Components

### Core Services
1. **API Gateway** (Node.js/Express)
   - JWT Authentication
   - Redis Caching
   - Task Management
   - WebSocket Proxy
   - Service Routing

2. **Game Service** (Go)
   - Lobby Management
   - WebSocket Server
   - Real-time Updates
   - Roleplay Integration

3. **Task Service** (Go)
   - Task Assignment
   - Task Manager
   - Timeout Control
   - Concurrent Processing

4. **Voting Service** (Python/FastAPI)
   - Vote Processing
   - Task Manager
   - Concurrent Control
   - Game Integration

5. **Roleplay Service** (Python/FastAPI)
   - Action Management
   - WebSocket Broadcasting
   - Real-time Events
   - Game State Updates

### Supporting Services
- **Communication Service**: Chat management and message routing
- **Shop Service**: Item management and purchase processing
- **Character Service**: Character management and customization
- **Town Service**: Location management and movement tracking
- **Rumors Service**: Rumor management and information spreading
- **User Management Service**: User authentication and account management

### Infrastructure
- **Redis Cache**: High-performance caching layer
- **PostgreSQL Cluster**: Distributed database system
- **Docker Hub**: Container registry
- **GitHub Actions**: CI/CD pipeline

## Data Flow

### 1. Client Request Flow
```
Client → API Gateway → Authentication → Cache Check → Service → Database
```

### 2. WebSocket Communication
```
Client ↔ Game Service WebSocket ↔ Roleplay Service WebSocket
```

### 3. Real-time Updates
```
Roleplay Action → Game Service → WebSocket Broadcast → Connected Clients
```

### 4. Caching Strategy
```
GET Request → Cache Check → Cache Hit (Return) / Cache Miss (Service → Cache Store)
```

## Performance Optimizations

### 1. Caching Strategy
- **GET Requests**: 5-minute TTL for general requests
- **Authentication**: 24-hour TTL for user tokens, 1-hour for service tokens
- **Cache Invalidation**: Automatic on data-modifying operations

### 2. Task Management
- **Gateway**: 50 concurrent tasks, 30-second timeout
- **Task Service**: 20 concurrent tasks, 30-second timeout
- **Voting Service**: 10 concurrent tasks, 30-second timeout

### 3. WebSocket Optimization
- **Connection Pooling**: Efficient WebSocket connection management
- **Message Broadcasting**: Targeted game-specific message delivery
- **Keep-alive**: Automatic ping/pong for connection health

## Security Features

### 1. Authentication
- JWT-based authentication
- Service-to-service authentication
- Role-based access control
- Token expiration and refresh

### 2. Request Security
- Input validation
- SQL injection prevention
- XSS protection
- CORS configuration

### 3. Infrastructure Security
- Container isolation
- Network segmentation
- Secret management
- Secure communication

## Monitoring & Observability

### 1. Health Checks
- Service health endpoints
- Database connectivity checks
- Cache status monitoring
- Task manager statistics

### 2. Metrics
- Request/response times
- Cache hit/miss ratios
- Task completion rates
- WebSocket connection counts

### 3. Logging
- Structured logging
- Request tracing
- Error tracking
- Performance monitoring

## Deployment

### 1. Docker Compose
- Multi-service orchestration
- Network configuration
- Volume management
- Environment variables

### 2. CI/CD Pipeline
- Automated testing
- Container building
- Registry pushing
- Version tagging

### 3. Production Considerations
- Load balancing
- Auto-scaling
- Health monitoring
- Backup strategies

## API Endpoints

### Gateway Endpoints
- `POST /api/gateway/user-token` - Generate user token
- `POST /api/gateway/service-token` - Generate service token
- `GET /api/gateway/cache/stats` - Cache statistics
- `POST /api/gateway/cache/clear` - Clear cache
- `GET /api/gateway/task-stats` - Task manager statistics

### Service Endpoints
- `GET /api/task/stats` - Task service statistics
- `GET /api/voting/task/stats` - Voting service statistics
- `GET /api/roleplay/ws/{game_id}` - WebSocket connection
- `GET /api/game/ws/{game_id}/{player_id}` - Game WebSocket

## Configuration

### Environment Variables
```bash
# Gateway
REDIS_URL=redis://localhost:6379
GATEWAY_MAX_CONCURRENT_TASKS=50
GATEWAY_TASK_TIMEOUT_MS=30000

# Task Service
MAX_CONCURRENT_TASKS=20
TASK_TIMEOUT=30s

# Voting Service
VOTING_MAX_CONCURRENT_TASKS=10
VOTING_TASK_TIMEOUT_SECONDS=30.0
```

### Docker Hub Configuration
```yaml
# GitHub Secrets Required
DOCKERHUB_USERNAME=your-username
DOCKERHUB_TOKEN=your-token
```

## Future Enhancements

### 1. Scalability
- Horizontal scaling
- Load balancing
- Auto-scaling groups
- Database sharding

### 2. Performance
- CDN integration
- Advanced caching strategies
- Database optimization
- Message queuing

### 3. Monitoring
- APM integration
- Real-time dashboards
- Alerting systems
- Performance analytics

## Conclusion

The updated Mafia District architecture now includes:
- ✅ High-performance caching system
- ✅ Real-time WebSocket communication
- ✅ Robust task management
- ✅ Comprehensive authentication
- ✅ Automated CI/CD pipeline
- ✅ Production-ready deployment

This architecture provides a solid foundation for a scalable, maintainable, and performant microservices system.
