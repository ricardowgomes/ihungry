/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const { getAllProducts } = require("./helperFunctions");

module.exports = (db) => {
  router.post("/", (req, res) => {
    const options = req.body;

    getAllProducts(options)
      .then(data => {
        const menu = data;
        res.json({ menu });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/product_view", (req, res) => {
    const productId = req.body.id;
    db.query(`SELECT * FROM products WHERE products.id = ${productId};`)
      .then(data => {
        const menu = data.rows;
        res.json({ menu });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  })
  return router;
};
