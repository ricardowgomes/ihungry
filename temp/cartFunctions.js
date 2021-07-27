const { Pool } = require('pg');
const dbParams = require('../lib/db');

const pool = new Pool(dbParams);

// Creates a new Id for a cart
const createNewCart = (object) => {
  const userId = object.userId;

  const queryString = `INSERT INTO carts(userId) VALUES($1) RETURNING *; `;
  const queryParams = [userId];

  return pool
    .query(queryString, queryParams)
    .then((result) => {
      if (result.rows.length > 0) {
        return result.rows;
      }
      return null;
    })
    .catch((err) => err.message);
};

// Get the cart_id based on the user_id on cookie
const getCartId = (userId) => {
  const queryString = `SELECT id FROM carts WHERE user_id = $1; `;
  const queryParams = [userId];

  return pool
    .query(queryString, queryParams)
    .then((result) => {
      if (result.rows.length > 0) {
        return result.row;
      }
      return null;
    })
    .catch((err) => err.message);
};

// Add item to cart, function should be call multiple times, for every item.
const addItemToCart = (product) => {
  const userId = product.user_id;
  const productId = product.id;
  const quantity = product.quantity;
  const cartId = getCartId(userId);

  const queryString = `INSERT INTO products_carts(cart_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *; `;
  const queryParams = [cartId, productId, quantity];

  return pool
    .query(queryString, queryParams)
    .then((result) => {
      if (result.rows.length > 0) {
        return result.rows;
      }
      return null;
    })
    .catch((err) => err.message);
};

// This function should return an object with all the products in the cart of a specific user
const productsInCart = (userId) => {
  const cartId = getCartId(userId);
  // const queryString = `SELECT * FROM carts WHERE user_id = $1; `;
  // const queryParams = [userId];

  // return pool
  //   .query(queryString, queryParams)
  //   .then((result) => {
  //     if (result.rows.length > 0) {
  //       return result.row;
  //     }
  //     return null;
  //   })
  //   .catch((err) => err.message);
};
