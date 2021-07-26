-- Order total to be pulled from order_total.sql query
SELECT carts.id AS order, products.name AS item, quantity AS qnty, products.price * quantity AS price
FROM products_carts
JOIN products ON product_id = products.id
JOIN carts ON cart_id = carts.id
WHERE cart_id = 5;
