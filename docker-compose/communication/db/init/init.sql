CREATE TYPE chat_type AS ENUM ('vote', 'role', 'location');

CREATE TABLE IF NOT EXISTS chats (
    id VARCHAR PRIMARY KEY,
    game_id VARCHAR NOT NULL,
    type chat_type NOT NULL,
    selector VARCHAR,
    open BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR PRIMARY KEY,
    chat_id VARCHAR REFERENCES chats,
    sender_id VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
