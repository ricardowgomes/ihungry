/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const { getAllOrdersById, getAllCurrentOrders, getAllCurrentOrdersById, getAllPastOrders, sumofOrderById, getItemsFromCart, insertCartOrder, emptyCart, insertNewOrder } = require("./helperFunctions");

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


  router.post("/addToCart/", (req, res) => {
    const userId = req.cookies.user_id;
    db.query(`SELECT id FROM carts WHERE user_id = ${userId}`)
      .then((cartId) => {
        db.query(`INSERT INTO products_carts (cart_id, product_id, quantity) VALUES (${cartId.rows[0].id},${req.body.product_id},1)`)
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
  });

  // using cookie to get user ID, then use the user ID to get cart ID for the user, then use the cart ID to retrieve the product data inside the cart
  router.get("/shoppingCart", (req, res) => {
    db.query(`SELECT carts.id FROM carts WHERE carts.user_id = ${req.cookies.user_id}`)
      .then(cart_id => {
        db.query(`SELECT products_carts.id AS productInCartID, carts.id AS CartID, products.name AS item, quantity AS qnty, products.price * quantity AS price, products.id AS productID
              FROM products_carts
              JOIN products ON product_id = products.id
              JOIN carts ON cart_id = carts.id
              WHERE cart_id = ${cart_id.rows[0].id}`)
          .then((data) => {
            res.json(data.rows);
          })
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

  });

  // delete item from cart
  router.post("/shoppingCart/delete", (req, res) => {
    const itemId = req.body.itemid;
    db.query(`DELETE FROM products_carts WHERE id = ${itemId}`)
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/shoppingCart/submitOrder", (req, res) => {
    const cartId = req.body.cartId;
    const userId = req.cookies.user_id;
    const newOrderId = insertNewOrder(userId);
    const cartItems = getItemsFromCart(cartId);
    Promise.all([newOrderId, cartItems])
      .then((values) => {
        insertCartOrder(values[0].rows[0].id, values[1].rows);
        emptyCart(cartId);//empty cart
        res.json(values[0].rows[0].id); //return new order id
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });

  });

  router.get("/orders_admin", (req, res) => {
    getAllPastOrders()
      .then(data => {
        const pastOrders = data;
        res.json(pastOrders);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/orders_todo", (req, res) => {
    getAllCurrentOrders()
      .then(data => {
        const currentOrders = data;
        res.json(currentOrders);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/orders", (req, res) => {
    const userId = req.cookies.user_id;

    Promise.all([
      getAllOrdersById(userId),
      getAllCurrentOrdersById(userId)
    ])
      .then((result) => {
        console.log(result);
        const [pastOrders, currentOrders] = result;
        res.json({ pastOrders, currentOrders });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

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
