# Mafia-District

## **Service Boundaries**

The following sections describe the key services and their responsibilities within the system.

### **1. User Management Service**

- **Responsibilities:**
  - Manages user information
  - Tracks the in-game currency(why?? it is not related)
  - Associates the user’s profile with device and location information
  - Ensures that each player can create and manage a single profile (how?)
- **Data Stored:**
  - ID
  - Email
  - Username
  - Password (hashed)
  - In-game currency (why? isn't it better to store in game service which already include player status and so on?)
  - Device and location info (Why we need to care about device and location? I can not create account from same device? from same location?)

---

### **2. Game Service**

- **Responsibilities:**
  - Manages the primary game logic, including the Day/Night cycle (or Town Service not in clear by condition) and event notifications (kill/heal/rumor/visiting place)
  - Tracks player status (alive/dead, role, _career_?) in each game lobby (till 30 players)
  - Initiates voting each night and tracks voting results. Also provides the list people that can be voted (shouldn't we just give the all list except player itself?)
- **Data Stored:**
  - Player status (alive/dead)
  - Player roles and career info

---

### **3. Shop Service**

- **Responsibilities:**
  - Allows players to buy in-game items using their currency
  - Balance in item quantities
  - Items available for purchase may include special items like garlic or water, used for defense or task completion (What service is responsible for determining what this items can do? shop service shouldn't be able to manage this, i think Roleplay Service should do this instead of Roleplay => Role)
  - What are vampires?
- **Data Stored:**
  - Item inventory
  - Player purchases
  - Transaction history

---

### **4. Roleplay Service**

- **Responsibilities:**
  - Manages the functionality of each in-game role and their specific abilities (Mafia ability to kill, Sheriff’s ability to guess roles)
  - Tracks and records actions performed by players according to their roles
  - Sends filtered announcements regarding player actions (e.g., murders, guesses) (if it is doing announcements we should allow user to communicate with this service?)
  - Should this service also manage roles of items?
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
  - Provides players with the option to buy random pieces of information using in-game currency (Random how? why?)
  - Information may reveal roles, tasks, or physical appearance of other players (how we can balance it?)
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
  - Tasks may require players to use specific items, visit locations, or interact with _people_ (what are people )
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

> > > > > > > 1ee4b78 (feat: add raw cpr)
