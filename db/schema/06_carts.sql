DROP TABLE IF EXISTS carts CASCADE;

CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INT REFERENCES users(id) ON DELETE CASCADE);
