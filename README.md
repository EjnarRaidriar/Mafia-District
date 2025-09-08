# Main branch

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
