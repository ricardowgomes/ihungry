-- Drop and recreate Widgets table (Example)
DROP TABLE IF EXISTS products_carts CASCADE;

CREATE TABLE products_carts (
  id SERIAL PRIMARY KEY NOT NULL,
  cart_id INTEGER REFERENCES carts(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INT NOT NULL DEFAULT 1
);
