const renderMenu = function (menuItems) {
  // Code to work with menu items in object format to render them on client side
  $('#products').empty();
  for (const item of menuItems.menu) {
    const $itemData = createProductElement(item);
    $('#products').append($itemData);
  }
};

//create each product for render menu
const createProductElement = (menuData) => {
  const $div = $('<div>').addClass('product-card').attr('id', menuData.id);
  const $img = $('<img>').attr('src', menuData.thumbnail_picture_url).attr('alt', menuData.name);
  const $span = $('<span>');
  $div.append($img, $span);
  const $div2 = $('<div2>');
  const $p2 = $('<p2>').attr('id', "price").text(`$${menuData.price}`);
  $span.append($div2, $p2);
  const $h3 = $('<h3>').text(menuData.name);
  // const $p = $('<p>').text(menuData.description);
  $div2.append($h3);

  return $div;
};

//render product view for a single product
const renderProductDetail = function (productData) {
  // Code to work with menu items in object format to render them on client side
  $('#product').empty();
  $('#product').append(createProductView(productData));
};

//create html for product view of a single product
const createProductView = (productData) => {
  return `
  <div class="product-view" id="${productData.id}">
    <img src="${productData.thumbnail_picture_url}" alt="${productData.name}"></img>
    <span>
      <div>
        <h3>${productData.name}</h3>
      </div>
      <p id="price">
        Price: $${productData.price}
      </p>
    </span>
    <hr>
    <p>${productData.description}</p>
    <button type="submit" id="add-to-cart-button">Add to cart</button>
    <button type="submit" class="return-to-menu">Back</button
  </div>
  `
};

const renderCart = function (cartData, totalPrice) {
  $('#cart-container').empty();
  for (const item of cartData) {
    const $itemData = createCartElement(item);
    $('#cart-container').append($itemData);
  }
  if(!cartData[0]) {
    $('#cart-container').append(`
      <div class="empty_cart">
        <h4>Cart is empty!</h4>
      </div>
      `);
  } else {
    $('#cart-container').append(`
      <span class='total-price'>Total price: $${totalPrice}</span>
      <div class="checkout">
        <button id='checkout' type='submit'>
          Submit Order
        </button>
        <h1 hidden id="cartid">${cartData[0].cartid}</h1>
      </div>
    `);
  }
};

const createCartElement = (cartData) => {
  return `
  <span class='individual-item' id=${cartData.productincartid}>
    <h4>${cartData.item}</h4>
    <p>Quantity ${cartData.qnty}</p>
    <p>Price $${cartData.price}</p>
    <button type='submit' class='delete-from-cart'><i class="far fa-trash-alt"></i></button>
  </span>
  <hr>

  `;
};

// Group products by order_id
const groupProductsByOrderId = (arrayOfObjects) => {
  const newObject = {};
  const newArray = [];

  for (const object of arrayOfObjects) {
    let created = new Date(object.order_created);
    let start = new Date(object.order_start);
    let end = new Date(object.order_end);

    if (!newObject[object.order_id]) {
      newObject[object.order_id] = {
        'product_name': [],
        'product_price': [],
        'quantity': [],
        'prep_time': [],
        'order_created': created.toUTCString(),
        'order_start': start.toUTCString(),
        'order_end': end.toUTCString(),
        'price_sum': 0
      };
    }

    newObject[object.order_id].product_name.push(object.product_name);
    newObject[object.order_id].product_price.push(Number(object.product_price) * Number(object.quantity));
    newObject[object.order_id].quantity.push(object.quantity);
    newObject[object.order_id].prep_time.push(object.prep_time);
    // newObject[object.order_id].order_created.push(object.order_created);
    // newObject[object.order_id].order_start.push(object.order_start);
    // newObject[object.order_id].order_end.push(object.order_end);
  }

  for (const key in newObject) {
    newObject[key].price_sum = newObject[key].product_price.reduce((acc, cur) => Number(acc) + Number(cur), 0);

    newArray.push({ [key]: newObject[key] });
  }

  for (const key in newObject) {
    newObject[key].prep_time = newObject[key].prep_time.reduce((acc, cur) => {
      if (cur > acc) {
        acc = cur;
      }
      return acc;
    });
  }

  return newArray;
};

const createOrderElementVendor = (ordersData) => {
  let orderStatus = 'no status';
  const id = Object.keys(ordersData);
  const date = ordersData[id].order_end.split(' ');
  const year = Number(date[3]);

  if (year > 1980) {
    orderStatus = `Great job! This order is finished!`;

  } else {
    orderStatus = `You have ${ordersData[id].prep_time} min. to finish this order!`;
  }

  const $orderContainer = $('<div>').attr('id', 'vendor-order-container');

  $orderContainer.append(`<span><p>#${id}</p><p>${orderStatus}</p></span>
    <hr>
    <span>${ordersData[id].order_created}</span>`);

  const quantity = ordersData[id].quantity;
  const products = ordersData[id].product_name;
  const prices = ordersData[id].product_price;

  const $itemsOrdered = $('<div>').addClass('items-ordered');
  const $quantity = $('<ul>');
  const $products = $('<ul>').addClass('products-name');
  const $prices = $('<ul>');


  quantity.forEach(item => $quantity.append(`<p>x${item}</p>`));
  products.forEach(item => $products.append(`<p>${item}</p>`));
  prices.forEach(item => $prices.append(`<p>$${item}</p>`));

  $itemsOrdered.append($quantity);
  $itemsOrdered.append($products);
  $itemsOrdered.append($prices);

  $orderContainer.append($itemsOrdered);

  const subTotal = ordersData[id].price_sum;
  const totals = `<span><p>Subtotal</p><p>$${subTotal}</p></span >
        <hr>
          <span><p>Delivery</p><p>Pickup</p></span>
          <span><p>GST (5%)</p><p>$${Math.floor(subTotal * 0.05 * 100) / 100}</p></span><span>
            <p>Total (CAD)</p><p> $${Math.floor((subTotal * 0.05 + subTotal) * 100) / 100}</p></span>`;

  $orderContainer.append(totals);

  return $orderContainer;
};

const renderVendorOrders = (orders) => {
  const $div = $('#vendors-main');
  $div.empty();

  for (const item of orders) {
    const $itemData = createOrderElementVendor(item);
    $('#vendors-main').append($itemData);
  }
};

const createOrderElement = (ordersData) => {
  const id = Object.keys(ordersData);
  const date = ordersData[id].order_end.split(' ');
  const year = Number(date[3]);

  let orderStatus = 'Completed';

  const $orderContainer = $('<div>').attr('id', 'vendor-order-container');

  $orderContainer.append(`<span><p>#${id}</p><p>${orderStatus}</p></span>
    <hr>
    <span>${ordersData[id].order_created}</span>`);

  const quantity = ordersData[id].quantity;
  const products = ordersData[id].product_name;
  const prices = ordersData[id].product_price;

  const $itemsOrdered = $('<div>').addClass('items-ordered');
  const $quantity = $('<ul>');
  const $products = $('<ul>').addClass('products-name');
  const $prices = $('<ul>');


  quantity.forEach(item => $quantity.append(`<p>x${item}</p>`));
  products.forEach(item => $products.append(`<p>${item}</p>`));
  prices.forEach(item => $prices.append(`<p>$${item}</p>`));

  $itemsOrdered.append($quantity);
  $itemsOrdered.append($products);
  $itemsOrdered.append($prices);

  $orderContainer.append($itemsOrdered);

  const subTotal = ordersData[id].price_sum;
  const totals = `<span><p>Subtotal</p><p>$${subTotal}</p></span >
        <hr>
          <span><p>Delivery</p><p>Pickup</p></span>
          <span><p>GST (5%)</p><p>$${Math.floor(subTotal * 0.05 * 100) / 100}</p></span><span>
            <p>Total (CAD)</p><p> $${Math.floor((subTotal * 0.05 + subTotal) * 100) / 100}</p></span>`;

  $orderContainer.append(totals);

  return $orderContainer;
};

const createCurrentOrderElement = (ordersData) => {
  const id = Object.keys(ordersData);
  const date = ordersData[id].order_end.split(' ');
  const year = Number(date[3]);

  let orderStatus = `Your order will be done in ${ordersData[id].prep_time} minutes!`;

  // Main element for current order
  const $orderContainer = $('<div>').attr('id', 'current-order');

  // Top span with id and counter
  const $idCounterSpan = $('<span>');
  const $counter = $(`<p>${ordersData[id].prep_time}</p>`).attr('id', 'counter');
  $idCounterSpan.append(`<p>#${id}</p>`);
  $idCounterSpan.append($counter);
  $orderContainer.append($idCounterSpan);

  $orderContainer.append('<hr>');

  // Products ordered
  const $itemsOrdered = $('<div>').addClass('items-ordered');

  const quantity = ordersData[id].quantity;
  const products = ordersData[id].product_name;
  const prices = ordersData[id].product_price;

  const $quantity = $('<ul>');
  const $products = $('<ul>').addClass('products-name');
  const $prices = $('<ul>');

  quantity.forEach(item => $quantity.append(`<p>x${item}</p>`));
  products.forEach(item => $products.append(`<p>${item}</p>`));
  prices.forEach(item => $prices.append(`<p>$${item}</p>`));

  $itemsOrdered.append($quantity);
  $itemsOrdered.append($products);
  $itemsOrdered.append($prices);

  $orderContainer.append($itemsOrdered);

  const subTotal = ordersData[id].price_sum;
  const totals = `<span><p>Subtotal</p><p>$${subTotal}</p></span >
        <hr>
          <span><p>Delivery</p><p>Pickup</p></span>
          <span><p>GST (5%)</p><p>$${Math.floor(subTotal * 0.05 * 100) / 100}</p></span><span>
            <p>Total (CAD)</p><p> $${Math.floor((subTotal * 0.05 + subTotal) * 100) / 100}</p></span>`;

  $orderContainer.append(totals);

  $orderContainer.append(`<hr>`);
  $orderContainer.append(`<p class='status'>${orderStatus}</p>`);

  return $orderContainer;
};

const renderOrders = (orders) => {
  const $main = $('#main-html');
  $main.empty();

  $main.append(`<div id='vendors-main'></div>`);
  const $div = $('#vendors-main');

  for (const item of orders) {
    const $itemData = createOrderElement(item);
    $div.append($itemData);
  }
};

const renderCurrentOrders = (orders) => {
  const $main = $('#main-html');
  $main.prepend(`<section class="orders-main">`);
  const $div = $('.orders-main');

  for (const item of orders) {
    const $itemData = createCurrentOrderElement(item);
    $div.append($itemData);
  }
};

const countDown = () => {
  const $counterElement = $('#counter');
  const startingMinutes = Number($counterElement.text());
  let counter = startingMinutes * 60;

  setInterval(() => {
    const minutes = Math.floor(counter / 60);
    let seconds = counter % 60;

    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    $counterElement.text(`${minutes}:${seconds}`);
    counter--;

    if (counter < 1) {
      return $counterElement.text(`Ready to pickup`);
    }

  }, 1000);
};

$(document).ready(() => {

  // load menu from the server
  const loadMenu = (() => {
    $.ajax("/api/users/", { method: 'GET' })
      .then(function (menu) {
        renderMenu(menu);
      });
  });

  //show product detail upon clicking on the product in menu
  $('#products').on("click", ".product-card", function () {
    const productId = { id: $(this)['0'].id };
    return $.post('/api/widgets/product_view', productId)
      .then((productData) => {
        renderProductDetail(productData.menu['0']);
        $('#products').slideUp("fast");
        $('#food-type').slideUp("fast");
        $('#product').slideDown("slow");
      });
  });

  //put away product detail and go back to menu
  $('#product').on("click", ".return-to-menu", function() {
    $('#product').slideUp("slow");
    $('#food-type').slideDown("slow");
    $('#products').slideDown("slow");
  })

  //add to cart button, send product information to server to add product to cart in db
  $('#product').on('click', '#add-to-cart-button', function () {
    productId = { product_id: $(this)['0'].parentElement.id };
    $.post('/api/users/addToCart/', productId, (res) => {
    });
    $('#product').slideUp("slow");
  });

  // load cart from the server
  const loadCart = (() => {
    $.ajax("/api/users/shoppingCart", { method: 'GET' })
      .then(cartData => {
        let totalPrice = 0;
        for (product of cartData) {
          totalPrice += parseFloat(product.price);
        }
        totalPrice = totalPrice.toFixed(2);
        renderCart(cartData, totalPrice);
      });
  });

  // GET cart information and render
  $('.shopping-cart').on('click', function () {
    loadCart();
    if ($('.cart').is(":hidden")) {
      $('.cart').slideDown("slow");
    } else if ($('.cart').is(":visible")) {
      $('.cart').slideUp("slow");
    }

  });

  //delete item from cart
  $('#cart-container').on('click', '.delete-from-cart', function () {
    const itemId = { itemid: $(this)['0'].parentElement.id };
    $.post('/api/users/shoppingCart/delete', itemId)
      .then(loadCart());
  });

  //Submit order from cart
  $('#cart-container').on('click', '#checkout', function () {
    const cartId = { cartId: $('#cartid')['0'].innerText };
    $.post('/api/users/shoppingCart/submitOrder', cartId)
      .then(orderId => {
        $.get('/api/users/orders')
          .then((data) => {
            const { pastOrders, currentOrders } = data;

            renderOrders(groupProductsByOrderId(pastOrders));
            $('#vendors-main').prepend(`<h3>Past orders:</h3>`);
            renderCurrentOrders(groupProductsByOrderId(currentOrders));
            $('.orders-main').prepend(`<h3>Current orders:</h3>`);

            // Create a countdown for the current order
            countDown();
          });
      });
  });


  // filter the food type when clicked on icon
  $('.food').click(function () {
    const filter = { type: $(this)['0'].id };

    return $.post('/api/widgets/', filter)
      .then((menu) => {
        renderMenu(menu);
      });
  });

  loadMenu();

  // to render vendor's page
  const $vendorsMain = $('#vendors-main');

  const loadVendorOrders = (() => {
    $.ajax("/api/users/orders_todo", { method: 'GET' })
      .then(function (data) {
        const orders = groupProductsByOrderId(data);

        renderVendorOrders(orders);
        $vendorsMain.prepend(`<h3>You have orders to finish:</h3>`);
      });
  });

  loadVendorOrders();


  const $pastOrderVendorIcon = $('.orders-vendor');
  $pastOrderVendorIcon.click((event) => {
    event.preventDefault();

    $.get('/api/users/orders_admin')
      .then((data) => {
        // console.log(data);
        const orders = groupProductsByOrderId(data);

        renderVendorOrders(orders);
        $vendorsMain.prepend(`<h3>Orders completed:</h3>`);
      });
  });

  const $currentOrderVendorIcon = $('.todo-orders');
  $currentOrderVendorIcon.click((event) => {
    event.preventDefault();

    $.get('/api/users/orders_todo')
      .then((data) => {
        const orders = groupProductsByOrderId(data);

        renderVendorOrders(orders);
        $vendorsMain.prepend(`<h3>You have orders to finish:</h3>`);
      });
  });

  const $OrderIcon = $('.orders');
  $OrderIcon.click((event) => {
    event.preventDefault();

    $.get('/api/users/orders')
      .then((data) => {
        const { pastOrders, currentOrders } = data;

        renderOrders(groupProductsByOrderId(pastOrders));
        $('#vendors-main').prepend(`<h3>Past orders:</h3>`);
        renderCurrentOrders(groupProductsByOrderId(currentOrders));
        $('.orders-main').prepend(`<h3>Current orders:</h3>`);

        // Create a countdown for the current order
        countDown();
      });
  });
});



