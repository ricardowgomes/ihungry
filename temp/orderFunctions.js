const { Pool } = require('pg');
const dbParams = require('../lib/db');

const pool = new Pool(dbParams);


const getCurrentOrder = (userId) => {

};

const getPastOrders = (userId) => {
  const queryString = `SELECT * FROM orders JOIN properties ON properties.id = property_id WHERE guest_id = $1 GROUP BY reservations.id, properties.id, properties.title, cost_per_night
  ORDER BY start_date DESC LIMIT $2; `;
  const queryParams = [guest_id, limit];

  return pool
    .query(queryString, queryParams)
    .then((result) => {
      if (result.rows.length > 0) {
        console.log('My reservations', result.rows);
        return result.rows;
      }
      return null;
    })
    .catch((err) => err.message);
};

// Adds a new order to the database
const addOrder = (order) => {
  const keys = Object.keys(order);
  const queryParams = Object.values(order);

  let queryString = `INSERT INTO orders (`;
  for (let i = 0; i < keys.length; i++) {
    if (i === 0) {
      queryString += `${keys[i]}`;

    } else {
      queryString += `, ${keys[i]}`;
    }
  }

  queryString += `) VALUES (`;

  for (let i = 1; i <= keys.length; i++) {
    if (i !== keys.length) {
      queryString += `$${i}, `;

    } else {
      queryString += `$${i}`;
    }
  }

  queryString += `) RETURNING *;`;

  return pool
    .query(queryString, queryParams)
    .then((result) => {
      if (result.rows.length > 0) {
        return result.rows[0];
      }
      return null;
    })
    .catch((err) => err.message);
};

// CREATE TABLE orders_products(
//   id SERIAL PRIMARY KEY NOT NULL,
//   product_id INT REFERENCES products(id) ON DELETE CASCADE,
//   order_id INT REFERENCES orders(id) ON DELETE CASCADE,
//   quantity INT NOT NULL DEFAULT 1
// );


const finishOrder = (orderId) => {

};

