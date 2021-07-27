/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM products;`)
      .then(data => {
        const menu = data.rows;
        res.json({ menu });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  router.post("/addToCart/", (req,res)=>{
    db.query(`INSERT INTO products_carts (cart_id, product_id, quantity) VALUES (1,${req.body.product_id},1)`)
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  })
  router.get("/shoppingCart", (req,res)=>{
    console.log(req.cookies)
    db.query(`SELECT carts.id FROM carts WHERE carts.user_id = ${req.cookies.user_id}`)
      .then(cart_id => {
        db.query(`SELECT carts.id AS order, products.name AS item, quantity AS qnty, products.price * quantity AS price
              FROM products_carts
              JOIN products ON product_id = products.id
              JOIN carts ON cart_id = carts.id
              WHERE cart_id = ${cart_id.rows[0].id}`)
              .then((data)=>{res.json(data.rows)})
              .catch(err => {
                res
                  .status(500)
                  .json({ error: err.message });
              });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
     //use req.cookie to find user and therefore cart_id

  })
  return router;
};



// module.exports = (db) => {
//   router.get("/", (req, res) => {
//     db.query(`SELECT * FROM users;`)
//       .then(data => {
//         const users = data.rows;
//         res.json({ users });
//       })
//       .catch(err => {
//         res
//           .status(500)
//           .json({ error: err.message });
//       });
//   });
//   return router;
// };
