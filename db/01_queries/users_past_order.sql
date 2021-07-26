SELECT orders.id AS order, products.name AS item, quantity AS qnty, products.price * quantity AS price
FROM orders_products
JOIN products ON product_id = products.id
JOIN orders ON order_id = orders.id
WHERE user_id = 5;
