CREATE TABLE IF NOT EXISTS locations (
    id TEXT PRIMARY KEY,
    name TEXT
);

CREATE TABLE IF NOT EXISTS user_movements (
    userId TEXT,
    locationId TEXT references locations(id),
    arrived_at TIMESTAMPTZ DEFAULT now()
);
