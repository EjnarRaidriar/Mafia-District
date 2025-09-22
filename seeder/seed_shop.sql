-- Seed script for Shop Service database (shop_db)
-- Run this with: psql -h localhost -p 5433 -U user -d shop_db -f seed_shop.sql

DO $$
BEGIN
    -- Check if the items table is empty
    IF (SELECT COUNT(*) FROM "Items") = 0 THEN
        INSERT INTO "Items" (id, name, price) VALUES
        (1, 'Garlic', 50),
        (2, 'Cross', 75);
        RAISE NOTICE 'Seeded initial items: Garlic, Cross';
    ELSE
        RAISE NOTICE 'Items table is not empty, skipping seed.';
    END IF;
END $$;
