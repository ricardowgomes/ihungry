const { Pool } = require('pg');
const dbParams = require('../lib/db');
// require('dotenv').config();

const pool = new Pool(dbParams);

const getAllProducts = (options, limit = 10) => {
  // Dinamic SQL parameters
  const queryParams = [];

  // Inicial string
  let queryString = `SELECT products.* FROM products `;

  // 3
  if (options.type) {
    queryParams.push(`%${options.type.toLowerCase()}%`);
    queryString += `WHERE LOWER(type) LIKE $${queryParams.length} `;
  }

  if (options.minimum_price) {
    queryParams.push(options.minimum_price * 100);
    if (queryParams.length === 1) {
      queryString += `WHERE price > $${queryParams.length} `;
    } else {
      queryString += `AND price > $${queryParams.length} `;
    }
  }

  if (options.maximum_price) {
    queryParams.push(options.maximum_price * 100);
    if (queryParams.length === 1) {
      queryString += `WHERE price < $${queryParams.length} `;
    } else {
      queryString += `AND price < $${queryParams.length} `;
    }
  }

  // Limit is always the last param
  queryParams.push(limit);
  queryString += `ORDER BY name LIMIT $${queryParams.length};`;

  return pool
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      err.message;
    });
};

// Function get all past orders of a user
const getAllPastOrdersById = (userId, limit = 10) => {
  const queryParams = [userId, limit];

  // Inicial string
  let queryString = `
  SELECT
  orders.id AS order_id,
  products.name AS product_name,
  products.price AS product_price,
  orders_products.quantity AS quantity,
  products.prep_time AS prep_time,
  orders.order_created AS order_created,
  orders.order_start AS order_start,
  orders.order_end AS order_end
  FROM orders_products
  JOIN orders ON orders.id = orders_products.order_id
  JOIN products ON products.id = orders_products.product_id
  WHERE user_id = $${userId}
  AND orders.order_end IS NOT NULL `;

  queryString += `ORDER BY orders.order_end LIMIT $${queryParams.length};`;
  console.log(queryString, queryParams);

  return pool
    .query(queryString, queryParams)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      err.message;
    });
};

// Function get current orders of a user
const getCurrentOrderById = (userId, limit = 1) => {
  const queryParams = [userId, limit];

  // Inicial string
  let queryString = `
  SELECT
  orders.id AS orderId,
  products.name AS productName,
  products.price AS productPrice,
  orders_products.quantity AS quantity,
  products.prep_time AS prepTime,
  orders.order_created AS orderCreated,
  orders.order_start AS orderStart,
  orders.order_end AS orderEnd
  FROM orders_products
  JOIN orders ON orders.id = orders_products.order_id
  JOIN products ON products.id = orders_products.product_id
  WHERE user_id = $${userId}
  AND orders.order_end IS NULL `;

  queryParams.push(limit);

  queryString += `ORDER BY orders.order_end LIMIT $${queryParams.length};`;

  return pool
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      err.message;
    });
};

// Make a query to database to get all orders to show to the vendor
const getAllCurrentOrders = (limit = 10) => {
  const queryParams = [limit];

  // Inicial string
  let queryString = `
  SELECT
  orders.id AS orderId,
  products.name AS productName,
  products.price AS productPrice,
  orders_products.quantity AS quantity,
  products.prep_time AS prepTime,
  orders.order_created AS orderCreated,
  orders.order_start AS orderStart,
  orders.order_end AS orderEnd
  FROM orders_products
  JOIN orders ON orders.id = orders_products.order_id
  JOIN products ON products.id = orders_products.product_id
  WHERE orders.order_end IS NULL `;

  queryParams.push(limit);

  queryString += `ORDER BY orders.order_end LIMIT $${queryParams.length};`;

  return pool
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      err.message;
    });
};

const getAllPastOrders = (limit = 20) => {
  const queryParams = [limit];

  // Inicial string
  let queryString = `
  SELECT
  orders.id AS order_id,
  products.name AS product_name,
  products.price AS product_price,
  orders_products.quantity AS quantity,
  products.prep_time AS prep_time,
  orders.order_created AS order_created,
  orders.order_start AS order_start,
  orders.order_end AS order_end
  FROM orders_products
  JOIN orders ON orders.id = orders_products.order_id
  JOIN products ON products.id = orders_products.product_id
  AND orders.order_end IS NOT NULL `;

  queryString += `ORDER BY orders.order_end LIMIT $${queryParams.length};`;

  return pool
    .query(queryString, queryParams)
    .then((result) => {

      if (!result) {
        return null;
      }

      return result.rows;
    })
    .catch((err) => {
      err.message;
    });
};

const sumofOrderById = (orderId) => {
  const queryParams = [orderId];

  // Inicial string
  let queryString = `
  SUM(products.price) AS sum_of_order
  FROM orders_products
  JOIN orders ON orders.id = orders_products.order_id
  JOIN products ON products.id = orders_products.product_id
  WHERE orders.id = $1;
  `;

  return pool
    .query(queryString, queryParams)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      err.message;
    });
};

const checkIfUserIsAdmin = (userId) => {
  const queryParams = [userId];

  // Inicial string
  let queryString = `SELECT is_admin FROM users WHERE id = $${queryParams.length};`;

  return pool
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      err.message;
    });
};

module.exports = { getAllProducts, getAllPastOrdersById, getAllCurrentOrders, getCurrentOrderById, getAllPastOrders, sumofOrderById, checkIfUserIsAdmin };
