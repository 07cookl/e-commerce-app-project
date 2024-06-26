-- CREATE TABLE customers (
--     id serial PRIMARY KEY,
--     email varchar UNIQUE,
--     password varchar
-- );

-- CREATE TABLE orders (
--     id serial PRIMARY KEY,
--     date date,
--     customer_id integer REFERENCES customers(id)
-- );

-- CREATE TABLE products (
--     id serial PRIMARY KEY,
--     name varchar UNIQUE,
--     description varchar,
--     quantity_in_stock integer,
--     price money
-- );

-- CREATE TABLE orders_products (
--     order_id integer REFERENCES orders(id),
--     product_id integer REFERENCES products(id),
--     PRIMARY KEY (order_id, product_id)
-- );

-- INSERT INTO customers (email, password)
-- VALUES ('Iron.Man@avengers.com', 'password'),
-- ('Captain.America@avengers.com', 'password'),
-- ('Thor.Odinson@avengers.com', 'password');

-- INSERT INTO orders (date, customer_id)
-- VALUES ('2024-04-07', 1),
-- ('2024-04-07', 2),
-- ('2024-04-07', 3),
-- ('2024-04-08', 1),
-- ('2024-04-08', 2),
-- ('2024-04-08', 3),
-- ('2024-04-09', 1),
-- ('2024-04-09', 2),
-- ('2024-04-09', 3),
-- ('2024-04-10', 1),
-- ('2024-04-10', 2),
-- ('2024-04-10', 3),
-- ('2024-04-11', 1),
-- ('2024-04-11', 2),
-- ('2024-04-11', 3),
-- ('2024-04-12', 1),
-- ('2024-04-12', 2),
-- ('2024-04-12', 3);

-- INSERT INTO products (name, description, quantity_in_stock, price)
-- VALUES ('Item 1', 'Item 1 description', 40, 14.99),
-- ('Item 2', 'Item 2 description', 40, 17.99),
-- ('Item 3', 'Item 3 description', 50, 12.99),
-- ('Item 4', 'Item 4 description', 60, 11.99),
-- ('Item 5', 'Item 5 description', 70, 19.99);

-- INSERT INTO orders_products (order_id, product_id)
-- VALUES (1, 4),
-- (2, 1),
-- (3, 3),
-- (3, 2),
-- (4, 5),
-- (5, 2),
-- (6, 1),
-- (7, 1),
-- (8, 3),
-- (8, 1),
-- (8, 5),
-- (9, 4),
-- (10, 5),
-- (11, 2),
-- (12, 3),
-- (13, 4),
-- (13, 3),
-- (13, 5),
-- (14, 4),
-- (15, 1),
-- (16, 1),
-- (17, 5),
-- (18, 2);

-- ALTER TABLE customers
-- ADD COLUMN username varchar;

-- UPDATE customers
-- SET username = 'IronMan123'
-- WHERE id = 1;

-- UPDATE customers
-- SET username = 'CaptainAmerica123'
-- WHERE id = 2;

-- UPDATE customers
-- SET username = 'GodOfThunder123'
-- WHERE id = 3;

-- CREATE TABLE categories (
--     id serial PRIMARY KEY,
--     name varchar
-- );

-- INSERT INTO categories (name)
-- VALUES ('Category 1'),
-- ('Category 2'),
-- ('Category 3'),
-- ('Category 4'),
-- ('Category 5');

-- ALTER TABLE products
-- ADD COLUMN category_id integer;

-- ALTER TABLE products
-- ADD FOREIGN KEY (category_id) REFERENCES categories(id);

-- UPDATE products
-- SET category_id = 1
-- WHERE id = 1;

-- UPDATE products
-- SET category_id = 2
-- WHERE id = 2;

-- UPDATE products
-- SET category_id = 3
-- WHERE id = 3;

-- UPDATE products
-- SET category_id = 4
-- WHERE id = 4;

-- UPDATE products
-- SET category_id = 5
-- WHERE id = 5;

-- CREATE TABLE carts (
--     id serial PRIMARY KEY,
--     customer_id integer REFERENCES customers(id)
-- );

-- CREATE TABLE carts_products (
--     cart_id integer REFERENCES carts(id),
--     product_id integer REFERENCES products(id),
--     PRIMARY KEY (cart_id, product_id)
-- );

-- INSERT INTO carts (customer_id)
-- VALUES (1),
-- (2),
-- (3);

-- INSERT INTO carts_products (cart_id, product_id)
-- VALUES (20, 1),
-- (20, 4),
-- (20, 5),
-- (21, 2),
-- (21, 3),
-- (21, 4),
-- (22, 1),
-- (22, 2);

-- CREATE TABLE federated_credentials (
--     user_id serial PRIMARY KEY,
--     provider varchar,
--     subject varchar
-- );

-- ALTER TABLE products
-- ADD COLUMN price_code varchar;

-- UPDATE products
-- SET price_code = 'price_1PEtzTLVeJ6uCzHuUqQiHOBh'
-- WHERE id = 1;

-- UPDATE products
-- SET name = 'Iron Man Blaster'
-- WHERE id = 1;

-- UPDATE products
-- SET description = 'We love this 3000.'
-- WHERE id = 1;

-- UPDATE products
-- SET price_code = 'price_1PEtzoLVeJ6uCzHuH7Ta4GMK'
-- WHERE id = 2;

-- UPDATE products
-- SET name = 'Cap''s Shield'
-- WHERE id = 2;

-- UPDATE products
-- SET description = 'We can do this all day.'
-- WHERE id = 2;

-- UPDATE products
-- SET price_code = 'price_1PEtteLVeJ6uCzHu0NWRCyz0'
-- WHERE id = 3;

-- UPDATE products
-- SET name = 'Mjolnir'
-- WHERE id = 3;

-- UPDATE products
-- SET description = 'Are you Thor, God of Hammers?'
-- WHERE id = 3;

-- UPDATE products
-- SET price_code = 'price_1PEu07LVeJ6uCzHuMBcSf6Xy'
-- WHERE id = 4;

-- UPDATE products
-- SET name = 'Hawkeye''s Bow'
-- WHERE id = 4;

-- UPDATE products
-- SET description = 'Useful for LARPing, just like Hawkeye.'
-- WHERE id = 4;

-- UPDATE products
-- SET price_code = 'price_1PEu0HLVeJ6uCzHu2oHqwplW'
-- WHERE id = 5;

-- UPDATE products
-- SET name = 'Hulk Fists'
-- WHERE id = 5;

-- UPDATE products
-- SET description = 'Smash!'
-- WHERE id = 5;

-- ALTER TABLE products
-- ADD COLUMN img_src varchar;

-- UPDATE products
-- SET img_src = '../../resources/images/products/ironman.jpg'
-- WHERE id = 1;

-- ALTER TABLE products
-- DROP COLUMN img_src;