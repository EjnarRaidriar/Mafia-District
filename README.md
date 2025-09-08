# Mafia-District

## Definitions

- **Career** - refers to in-game profession which maybe assigns role-specific tasks
- **Vampires** - is mafia role

## **Service Boundaries**

The following sections describe the key services and their responsibilities within the system.

### **1. User Management Service**

- **Responsibilities:**
  - Manages user information
  - Associates the user’s profile with device and location information
  - Ensures that each player can create and manage a single profile
- **Data Stored:**
  - ID
  - Email
  - Username
  - Password
  - Device and location info

---

### **2. Game Service**

- **Responsibilities:**
  - Manages the primary game logic, including the Day/Night cycle and event notifications (kill/heal/rumor/visiting place)
  - Tracks player status (alive/dead, role, career) in each game lobby (till 30 players)
  - Initiates voting each night and tracks voting results. Also provides the list people that can be voted
  - In-game currency
- **Data Stored:**
  - Player status (alive/dead)
  - Player roles, career info and in-game currency

---

### **3. Shop Service**

- **Responsibilities:**
  - Allows players to buy in-game items using their currency
  - Balance in item quantities
  - Items available for purchase may include special items like garlic or water, used for defense or task completion
- **Data Stored:**
  - Item inventory
  - Player purchases
  - Transaction history

---

### **4. Roleplay Service**

- **Responsibilities:**
  - Manages the functionality of each in-game role and their specific abilities (Mafia ability to kill, Sheriff’s ability to guess roles)
  - Tracks and records actions performed by players according to their roles
  - Sends filtered announcements regarding player actions (e.g., murders, guesses) (probably send announcements to Game Service and Game Service to users)
  - Handle role/ability for items
- **Data Stored:**`
  - Roles
  - Roles actions
  - Announcements related to actions

---

### **5. Town Service**

- **Responsibilities:**
  - Contains all locations within the town, including the Shop and Informator Bureau
  - Tracks and records player movements within the town
  - Reports player movements to the Task Service 1for task-related actions
- **Data Stored:**
  - Location data
  - Player movement logs

---

### **6. Character Service**

- **Responsibilities:**
  - Allows players to customize their in-game characters
  - Monitors the player’s inventory of purchased items from the Shop
  - Manages customization options such as hair, clothing, and accessories
- **Data Stored:**
  - Customization options (e.g., hairstyle, coat)
  - Inventory items purchased

---

### **7. Rumors Service**

- **Responsibilities:**
  - Provides players with the option to buy random pieces of information using in-game currency
  - Information may reveal roles, tasks, or physical appearance of other players
  - Information availability varies based on player role and actions in the game
- **Data Stored:**
  - Rumor information
  - Currency transaction for rumors

---

### **8. Communication Service**

- **Responsibilities:**
  - Manages global chat for the town during voting hours
  - Supports private chat between specific groups (e.g., Mafia members or players located in the same area)
- **Data Stored:**
  - Chat messages
  - User chat history

---

### **9. Task Service**

- **Responsibilities:**
  - Assigns daily tasks to players based on their roles and careers
  - Players earn in-game currency by completing tasks
  - Tasks may require players to use specific items, visit locations, or interact with players
  - Some tasks may result in rumors being generated
- **Data Stored:**
  - Task assignments
  - Player task completions
  - Rumor generation

---

### **10. Voting Service**

- **Responsibilities:**
  - Collects and counts votes during the evening voting phase
  - Tracks which players voted for which others and calculates the final voting result
  - Notifies the Game Service about the exiled player after voting
- **Data Stored:**
  - Vote counts
  - Voting history (who voted for whom)

---

# Technologies

## User Management & Game Service

### Technology Stack

- **Language**: Go
- **Framework**: Golang Standard Library
- **Communication Pattern**: RESTful API or gRPC

### Trade-offs

- **Pros**: Go's is simple, lightweight both in terms of CPU and memory usage, robust ecosystem, and built in concurrency support
- **Cons**: Verbose error handling, slower to iterate on than a language like Python or Javascript

---

## Shop Service

### Technology Stack

- **Language**: TypeScript
- **Framework**: Express.js
- **Communication Pattern**: RESTful API

### Trade-offs

- TypeScript’s strong typing and JavaScript runtime via Node.js provide a flexible, developer-friendly environment for handling high transaction volumes in a game with up to 30 players per lobby performing frequent purchases
- **Pros**: Strong type safety reduces runtime errors, ensuring reliable purchase and inventory logic
- **Cons**: Node.js single-threaded event loop may require careful optimization to handle peak loads compared to Go’s concurrency model

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

## Town Service

### Technology Stack

- **Language**: Go
- **Framework**: gRPC library, Gin
- **Communication Pattern**: WebSocket and gRPC

### Trade-offs

- Go's goroutines excel at managing concurrent game sessions and real-time player interactions
- **Pros**: Excellent concurrency for multiple games, fast WebSocket handling, simple deployment, mature networking libraries
- **Cons**: Less expressive type system than Rust, manual memory management compared to garbage collection trade-offs

## Character Service

### Technology Stack

- **Language**: Rust
- **Framework**: Axum
- **Communication Pattern**: gRPC

### Trade-offs

- Rust provides memory safety and performance for handling persistent user data and complex statistical calculations
- **Pros**: Zero-cost abstractions, memory safety prevents data corruption, excellent async performance, strong type system for data modeling
- **Cons**: Steeper learning curve, longer compilation times, smaller ecosystem compared to Go/Python

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

## **GitHub Workflow Setup**

### **1. Branch Structure**

- **Main Branch**: main
  - Represents the production-ready codebase.
  - Only accepts merges from the development branch after thorough review.
- **Development Branch**: development
  - Integration branch for all feature, bugfix, and hotfix branches.
  - Used for staging and testing before merging to main.
- **Feature/Bugfix/Hotfix Branches**:
  - Created from development for specific tasks.
  - Named using the convention: \<type>/\<service>-\<description>
    - **Types**: feature (feat), bugfix, hotfix, refactor
    - **Service**: e.g., shop, roleplay, game
      - **Example**: feature/shop-purchase-endpoint-123, bugfix/game-lobby-crash-456, hotfix/user-auth-vuln
      - **Additional**: \<description> can be ignored in some cases

### **2. Pull Request Approvals**

- **Requirement**: At least **3 approvals** from team members are required for merging any PR into main.
- **Admin Override**: Only the repository owner

### **Branching Naming Strategy**

- **Format**: \<type>/\<service>-\<short-description>
  - **Types**: feature (new functionality), bugfix (fixing issues), hotfix (urgent production fixes), refactor.
  - **Service**: Matches the service name (e.g., user, game, shop, roleplay).
  - **Short Description**: Brief, hyphenated description of the change.
- **Examples**:
  - feature/shop-item-quantity-algorithm
  - bugfix/roleplay-action-validation
  - hotfix/game-lobby-crash

### **3. Merging Strategy**

- **Merge to development**:
  - Use **squash and merge** to combine all commits into a single, clean commit with a descriptive message.
  - Ensures a linear history in development for easier tracking.
- **Merge to main**:
  - Use **merge commit** from development to main after passing CI/CD and approvals.
  - Preserves the context of the development cycle for release tracking.
- **Rebase**: Developers should rebase their feature branches onto the latest development before creating a PR to resolve conflicts early.

### **4. Test Coverage**

- **Requirement**: Minimum **20% test coverage** for each service.
- **Types of Tests**:
  - **Unit Tests**: Cover individual functions


## Endpoints

### User Management Service API

- **Endpoints**:
  - **GET** /api/user/:id - Retrieve user info (email, username, device info)
  - **POST** /api/user - Create a new user profile (enforce single profile via device/location checks)
  - **PUT** /api/user/:id - Update user info (e.g., username, password)
  - **DELETE** /api/user/:id - Delete user profile (admin only)

### Game Service API

- **Endpoints**:
  - **POST** `/api/game/lobbies` - Create a new game lobby (up to 30 players)
  - **GET** `/api/game/lobbies/:id` - Get lobby details (players, status)
  - **POST** `/api/game/lobbies/:id/join` - Join a lobby
  - **POST** `/api/game/lobbies/:id/start` - Start the game (triggers Day/Night cycle)

### Shop Service API

- **Format:** JSON
- **Endpoints**:
  - **GET** `/api/shop/items` - List available items (with quantities and prices)
  - **POST** `/api/shop/purchase` - Purchase an item (deducts currency, updates inventory)
  - **GET** `/api/shop/purchases/:userId` - Get user’s purchase history

### Roleplay Service API

- **Format**: JSON
- **Endpoints**:
  - **POST** `/api/roleplay/action` - Execute a role-specific action (e.g., Mafia kill, Sheriff guess)
  - **GET** `/api/roleplay/roles/:userId` - Get user’s role and allowed actions
  - **POST** `/api/roleplay/announcement` - Generate filtered announcement for an action

### Town Service API

- **Endpoints**:
  - **GET** `/api/town/locations` - List all town locations (e.g., Shop, Informator Bureau)
  - **POST** `/api/town/move` - Record player movement to a location
  - **GET** `/api/town/movements/:userId` - Get user’s movement history

### Character Service API

- **Endpoints**:
  - **POST** `/api/character/customize` - Customize character (e.g., hair, coat)
  - **GET** `/api/character/:userId` - Get character details and inventory
  - **PUT** `/api/character/inventory` - Update inventory (e.g., after Shop purchase)

### Rumors Service API

- **Endpoints**:
  - **POST** `/api/rumors/purchase` - Buy a random rumor (deducts currency)
  - **GET** `/api/rumors/:userId` - Get user’s purchased rumors

### Communication Service API

- **Endpoints**:
  - **POST** `/api/communication/global` - Send global chat message (voting hours)
  - **POST** `/api/communication/private` - Send private chat message (e.g., Mafia group)
  - **GET** `/api/communication/history/:userId` - Returns the chat messages visible to the user, including messages the user has sent and received (e.g., global chat, group chat, or private messages the user was a participant in).
    - Query Parameters (optional):
    - chatType: "global" | "private" | "group" (default: all)
    - limit: Number of messages to return
    - since: Timestamp to filter from

### Task Service API

- **Endpoints**:
  - **POST** `/api/task/assign` - Body: `{ lobbyId, day }` - Assign tasks to all players in a lobby when a new day starts
  - **POST** `/api/task/complete` - Body: `{ taskId, userId, lobbyId, evidence?, idempotencyKey }` - Mark a task as complete and award currency
  - **GET** `/api/task/:userId` - Query: `{ lobbyId, day }` - Get the list of tasks for a specific player in that lobby/day

### Voting Service API

- **Endpoints**:
  - **POST** `/api/voting/vote` - Body: `{ lobbyId, day, voterId, targetId, idempotencyKey }` - Submit a vote for a player
  - **GET** `/api/voting/results/:lobbyId` - Query: `{ lobbyId, day }` - Get voting results for a lobby and the exiled player
  - **GET** `/api/voting/history/:userId` - Get the voting history of a player

