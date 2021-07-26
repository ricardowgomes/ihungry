/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const { getAllProducts, renderProducts } = require("../temp/getProducts");

module.exports = (db) => {
  router.get("/", (req, res) => {
    // let query = `SELECT * FROM widgets`;
    // console.log(query);
    // db.query(query)
    getAllProducts({})
      .then(data => {
        // const widgets = data;
        res.json(data);
        renderProducts(data);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
