select products.name, quantity, cart_id
from products_carts
join products on product_id = products.id
join carts on cart_id = carts.id
where cart_id = 1;
