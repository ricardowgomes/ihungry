const { Pool } = require('pg');
const dbParams = require('../../lib/db');
// require('dotenv').config();

const pool = new Pool(dbParams);

// Get all products as default and also with filters.
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

const renderProducts = (products) => {

  // products.forEach((product) => {
  //   console.log(product.name);
  // });
};

const createProductContainer = (post) => {
  // Data from user:
  const uAvatar = post.user.avatars;
  const uName = post.user.name;
  const uHandle = post.user.handle;
  const cText = post.content.text;
  const timeCreated = timeago.format(post.created_at);

  // Creation of Footer
  const $flag = $('<i>').addClass('fas fa-flag');
  const $retweet = $('<i>').addClass('fas fa-retweet');
  const $heart = $('<i>').addClass('fas fa-heart');
  const $icons = $('<div>').addClass('icons');
  $icons.append($flag, $retweet, $heart);
  const $timeago = $('<span>').text(timeCreated);
  const $footer = $('<div>').addClass('tweet-footer');
  $footer.append($timeago, $icons);


  // Creation of Text Tweet
  const $tweetText = $('<p>').text(cText);
  const $tweetDiv = $('<div>').addClass('tweet-text');
  $tweetDiv.append($tweetText);

  // Creation of Text Header
  const $userAvatar = $('<img>').attr('src', uAvatar).attr('alt', 'user-avatar').addClass('tweet-text');
  const $userName = $('<span>').text(uName).addClass('name');
  const $leftDiv = $('<div>').append($userAvatar, $userName);
  const $userHandle = $('<span>').text(uHandle).addClass('user-handle');
  const $header = $('<div>').addClass('tweet-header');
  $header.append($leftDiv, $userHandle);

  const $post = $('<div>').addClass('tweet-container');
  $post.append($header, $tweetDiv, $('<hr>'), $footer);

  const $articleTweets = $('.display-tweets');
  $articleTweets.append($post);

  return $articleTweets;
};

// const renderProducts = (products) => {
//   let $tweetContainer = $('.display-tweets');
//   $tweetContainer.empty();
//   const sortedPosts = sortRight(posts);
//   for (const post of sortedPosts) {
//     const $post = createTweets(post);
//     $tweetContainer.prepend($post);
//   }
// };

module.exports = { getAllProducts, renderProducts };
