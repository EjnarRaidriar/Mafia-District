CREATE TABLE IF NOT EXISTS rumors (
    id VARCHAR PRIMARY KEY,
    content TEXT NOT NULL,
    game_id VARCHAR(50) NOT NULL,
    available_roles TEXT[] NOT NULL
);

CREATE TABLE IF NOT EXISTS user_rumors (
    user_id VARCHAR(50) NOT NULL,
    rumor_id VARCHAR REFERENCES rumors(id)
);
