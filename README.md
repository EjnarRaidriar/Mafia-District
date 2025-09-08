# Main branch

# Technologies

## Shop Service

### Technology Stack

- **Language**: Go (Golang)
- **Framework**: Standard library
- **Communication Pattern**: RESTful API

### Trade-offs

- Go's simplicity, fast execution, and built-in concurrency (goroutines) are ideal handling high transaction volumes in a game with up to 30 players per lobby performing frequent purchases.
- **Pros**: High performance, low memory required, and easy-to-maintain codebase suit a service with straightforward logic
- **Cons**: Verbose error handling, statically typed language which can we hard to implement with role service

---

## Roleplay Service

### Technology Stack

- **Language**: Python
- **Framework**: FastAPI
- **Communication Pattern**: RESTful API or gRPC

### Trade-offs

- Python is easy and has rich ecosystem which simplify implementing complex role logic and item effect rules
- **Pros**: Rapid development, and easy-to-maintain code for complex logic
- **Cons**: Slower runtime performance than GO

---

## Rumors service

### Technology Stack

- **Language**: Go
- **Framework**: gRPC library
- **Communication Pattern**: gRPC

### Trade-offs

- Go and gRPC work very well together
- No need to reimplement same calls indifferent languages, just codegen.

---

## Communication service

### Technology Stack

- **Language**: Go
- **Framework**: gRPC library
- **Communication Pattern**: gRPC with streams

### Trade-offs

- WebSockets is a mode widely suported alternative but will likely
  require some protocol over it.
- gRPC supports streaming of structured messages out of the box.
- Not every language supports gRPC streaming.

---

## Task Service

### Technology Stack

- **Language**: Go (Golang)
- **Framework**: Go standard library (net/http)
- **Communication Pattern**: REST API + sends events (Kafka/RabbitMQ)

### Trade-offs

- Go is good for giving out tasks to many players at the same time because of goroutines.
- **Pros**: Fast, reliable, uses little memory, great for parallel work.
- **Cons**: Writing business rules can be harder compared to Python; scheduling tools are limited.

---

## Voting Service

### Technology Stack

- **Language**: Python
- **Framework**: FastAPI
- **Communication Pattern**: REST API + sends events (to Game Service)

### Trade-offs

- Python is good for writing vote rules, counting results, and keeping history.
- **Pros**: Easy to read and write, fast to develop, big library support.
- **Cons**: Slower than Go, but not a problem because voting happens only once per night in each lobby.
