SELECT carts.id, users.name, users.mobile, products.name FROM carts
JOIN users on users.id = user_id
JOIN products_carts on carts.id = cart_id
JOIN products on products.id = product_id
GROUP BY carts.id, users.name, users.mobile, products.name
ORDER BY carts.id;
