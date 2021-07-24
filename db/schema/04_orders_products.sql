DROP TABLE IF EXISTS orders_products CASCADE;

CREATE TABLE orders_products {
  id SERIAL PRIMARY KEY NOT NULL,
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1
}
