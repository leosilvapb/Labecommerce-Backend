-- Active: 1689042286596@@127.0.0.1@3306

CREATE TABLE
    users(
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL
    );

SELECT * FROM users;

PRAGMA table_info('users');

INSERT INTO
    users(
        id,
        name,
        email,
        password,
        created_at
    )
VALUES (
        'u001',
        'Fulano',
        'fulano@email.com',
        'fulano123',
        DATE('now')
    ), (
        'u002',
        'Beltrana',
        'beltrana@email.com',
        'beltrana00',
        DATE('now')
    ), (
        "u003",
        "leonardo",
        "leo@email.com",
        "123456",
        DATE('now')
    );

DELETE FROM users WHERE id = "u001";

CREATE TABLE
    products(
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL
    );

SELECT * FROM products;

INSERT INTO
    products(
        id,
        name,
        price,
        description,
        image_url
    )
VALUES (
        "prod001",
        "Mouse gamer",
        250,
        "Melhor mouse do mercado!",
        "https://picsum.photos/seed/Monitor/400"
    ), (
        "prod002",
        "Monitor",
        900,
        "Monitor LED Full HD 24 polegadas",
        "https://picsum.photos/seed/Monitor/400"
    ), (
        "prod003",
        "SSD gamer",
        349.99,
        "Acelere seu sistema com velocidades incríveis de leitura e gravação.",
        "https://picsum.photos/seed/Monitor/400"
    ), (
        "prod004",
        "Placa de vídeo RTX 4080",
        8200,
        "Melhore o desempenho do seu PC em jogos com a nova placa RTX 4080",
        "https://picsum.photos/seed/Monitor/400"
    ), (
        "prod005",
        "Placa de vídeo RTX 3060TI",
        2300,
        "Melhore o desempenho do seu PC em jogos.",
        "https://picsum.photos/seed/Monitor/400"
    )