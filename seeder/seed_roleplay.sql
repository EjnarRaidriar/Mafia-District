-- Seed script for Roleplay Service database (roleplay_db)
-- Run this with: psql -h localhost -p 7100 -U user -d roleplay_db -f seed_roleplay.sql

DO $$
BEGIN
    -- Check if roles table is empty
    IF (SELECT COUNT(*) FROM roles) = 0 THEN
        INSERT INTO roles (id, name, ability) VALUES
        (1, 'Vampire', 'kill'),
        (2, 'Sheriff', 'guess'),
        (3, 'Alchemist', 'heal');
        RAISE NOTICE 'Seeded roles: Vampire, Sheriff, Alchemist';
    ELSE
        RAISE NOTICE 'Roles table is not empty, skipping seed.';
    END IF;
END $$;
