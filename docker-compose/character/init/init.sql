-- psql:postgres
create table if not exists character (
  id TEXT primary key,
  name TEXT
);

create table if not exists appearance (
  userId TEXT primary key references character(id),
  hair TEXT,
  coat TEXT,
  hat TEXT 
);

create table if not exists items (
  userId TEXT references character(id),
  id TEXT,
  name TEXT,
  quantity INT,
  PRIMARY KEY (userId, id)
);

INSERT INTO character
VALUES
    ('u123', 'Mark'),
    ('u002', 'Luke'),
    ('u003', 'Chad');

INSERT INTO appearance
VALUES
    ('u123', 'Brown', 'Trenchcoat', 'Top Hat'),
    ('u002', 'Blond', 'Hoplite Armor', 'Greek Helm'),
    ('u003', 'Brown', 'Topless', 'Nice Haircut');

INSERT INTO items
VALUES
    ('u123', 'i102', 'Bulletproof Vest', '1'),
    ('u123', 'i023', 'Poison', '3');
