-- Active: 1689042286596@@127.0.0.1@3306

CREATE TABLE
    users(
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL
    );

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
        DATETIME('now', 'localtime')
    ), (
        'u002',
        'Beltrana',
        'beltrana@email.com',
        'beltrana00',
        DATETIME('now', 'localtime')
    ), (
        'u003',
        'leonardo',
        'leo@email.com',
        '123456',
        DATETIME('now', 'localtime')
    );

CREATE TABLE
    products(
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL
    );

INSERT INTO
    products(
        id,
        name,
        price,
        description,
        image_url
    )
VALUES (
        'prod001',
        'Mouse gamer',
        250,
        'Melhor mouse do mercado!',
        'https://picsum.photos/seed/Monitor/400'
    ), (
        'prod002',
        'Monitor',
        900,
        'Monitor LED Full HD 24 polegadas',
        'https://picsum.photos/seed/Monitor/400'
    ), (
        'prod003',
        'SSD gamer',
        349.99,
        'Acelere seu sistema com velocidades incríveis de leitura e gravação.',
        'https://picsum.photos/seed/Monitor/400'
    ), (
        'prod004',
        'Placa de vídeo RTX 4080',
        8200,
        'Melhore o desempenho do seu PC em jogos com a nova placa RTX 4080',
        'https://picsum.photos/seed/Monitor/400'
    ), (
        'prod005',
        'Placa de vídeo RTX 3060TI',
        2300,
        'Melhore o desempenho do seu PC em jogos.',
        'https://picsum.photos/seed/Monitor/400'
    );

SELECT * FROM users;

SELECT * FROM products;

SELECT * FROM products WHERE name LIKE '%gamer%';

INSERT INTO
    users(
        id,
        name,
        email,
        password,
        created_at
    )
VALUES (
        'u004',
        'Amanda',
        'amanda@email.com',
        'amanda123',
        DATETIME('now', 'localtime')
    );

INSERT INTO
    products(
        id,
        name,
        price,
        description,
        image_url
    )
VALUES (
        'prod006',
        'Headset Gamer Redragon Zeus X H510',
        248,
        'O Headset Gamer Zeus X rgb conta com iluminação Chroma Mk. Com qualidade e som surround 7.1!',
        'https://picsum.photos/seed/Monitor/400'
    );

DELETE FROM users WHERE id = 'u004';

SELECT * FROM users;

DELETE FROM products WHERE id = 'prod006';

SELECT * FROM products;

UPDATE products
SET
    name = 'Headset Gamer Redragon Zeus X',
    price = 300,
    description = 'O Headset Gamer Zeus X rgb conta com qualidade e som surround 7.1!',
    image_url = 'https://picsum.photos/200/300'
WHERE id = 'prod006';

DROP TABLE users;

CREATE TABLE
    purchases(
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        buyer TEXT NOT NULL,
        total_price REAL NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY(buyer) REFERENCES users(id)
    );

INSERT INTO
    purchases(
        id,
        buyer,
        total_price,
        created_at
    )
VALUES (
        'purch001',
        'u004',
        8200,
        DATETIME('now', 'localtime')
    ), (
        'purch002',
        'u003',
        3200,
        DATETIME('now', 'localtime')
    ), (
        'purch003',
        'u001',
        4500,
        DATETIME('now', 'localtime')
    ), (
        'purch004',
        'u002',
        1850,
        DATETIME('now', 'localtime')
    );

SELECT * FROM purchases;

UPDATE purchases SET total_price = 8099 WHERE id = 'purch001';

UPDATE purchases SET total_price = 3300 WHERE id ='purch002';

UPDATE purchases SET total_price = 4550 WHERE id ='purch003';

UPDATE purchases SET total_price = 2050 WHERE id ='purch004';

DROP TABLE purchases;

SELECT
    purchases.id AS idPedido,
    purchases.buyer AS idCliente,
    users.name AS cliente,
    users.email,
    purchases.total_price AS precoTotal,
    purchases.created_at AS dataCompra
FROM purchases
    INNER JOIN users ON purchases.buyer = users.id;