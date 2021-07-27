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

module.exports = { getAllProducts };
