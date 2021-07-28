const renderMenu = function(menuItems) {
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
const renderProductDetail = function(productData) {
  // Code to work with menu items in object format to render them on client side
  $('#product').empty();
  $('#product').append(createProductView(productData));
};

//create html for product view of a single product
const createProductView = (productData) => {
  // const $form = $('<form>').attr('action','/api/users/addToCart/').attr('method','POST').attr('id','add-to-cart')
  const $div = $('<div>').addClass('product-view').attr('id', productData.id);
  // $form.append($div);
  const $img = $('<img>').attr('src', productData.thumbnail_picture_url).attr('alt', productData.name);
  const $span = $('<span>');
  const $hr = $('<hr>');
  const $p = $('<p>').text(productData.description);
  const $button = $('<button>').attr('type', 'submit').attr('id', 'add-to-cart-button').text('Add to cart');
  $div.append($img, $span, $hr, $p, $button);
  const $div2 = $('<div>');
  const $p2 = $('<p>').attr('id', 'price').text(productData.price);
  $span.append($div2, $p2);
  const $h3 = $('<h3>').text(productData.name);
  const $p3 = $('<p2>').text(productData.name);
  $div2.append($h3, $p3);

  return $div;
};

const renderCart = function(cartData, totalPrice) {
  $('#cart-container').empty();
  for (const item of cartData) {
    const $itemData = createCartElement(item);
    $('#cart-container').append($itemData);
  }
  $('#cart-container').append(`
    <span class='total-price'>Total price: $${totalPrice}</span>

    <button id='checkout' type='submit'>
      Submit Order
    </button>
    <h1 hidden id="cartid">${cartData[0].cartid}</h1>
  `);
};

const createCartElement = (cartData) => {
  return `

  <span class='individual-item' id=${cartData.productincartid}>
    <p>Quantity ${cartData.qnty}</p>
    <h4>${cartData.item}</h4>
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
  let orderStatus = 'no status';
  const id = Object.keys(ordersData);
  const date = ordersData[id].order_end.split(' ');
  const year = Number(date[3]);

  if (year > 1980) {
    orderStatus = `Current Order`;

  } else {
    orderStatus = `Your order will be done in ${ordersData[id].prep_time} minutes!`;
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

const renderOrders = (orders) => {
  const $div = $('#vendors-main');
  $div.empty();

  const $itemData = createOrderElementVendor(orders[0]);
  $('#vendors-main').append($itemData);
};

$(document).ready(() => {

  // load menu from the server
  const loadMenu = (() => {
    $.ajax("/api/users/", { method: 'GET' })
      .then(function(menu) {
        renderMenu(menu);
      });
  });
  //filter menu based on preset filters
  $('#products').on("click", ".product-card", function() {
    const productId = { id: $(this)['0'].id };
    return $.post('/api/widgets/product_view', productId)
      .then((productData) => {
        renderProductDetail(productData.menu['0']);
        $('#product').slideDown("slow");
      });
  });

  //add to cart button, send product information to server to add product to cart in db
  $('#product').on('click', '#add-to-cart-button', function() {
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
          totalPrice += parseInt(product.price);
        }
        renderCart(cartData, totalPrice);
      });
  });

  // GET cart information and render
  $('.shopping-cart').on('click', function() {
    loadCart();
    if ($('#cart-container').is(":hidden")) {
      $('#cart-container').slideDown("slow");
    } else if ($('#cart-container').is(":visible")) {
      $('#cart-container').slideUp("slow");
    }

  });

  //delete item from cart
  $('#cart-container').on('click', '.delete-from-cart', function() {
    const itemId = { itemid: $(this)['0'].parentElement.id };
    $.post('/api/users/shoppingCart/delete', itemId)
      .then(loadCart());
  });

  //Submit order from cart
  $('#cart-container').on('click', '#checkout', function() {
    const cartId = { cartId: $('#cartid')['0'].innerText };
    $.post('/api/users/shoppingCart/submitOrder', cartId)
      .then(orderId => {
        $.get('/api/users/orders')
          .then((data) => {
            renderVendorOrders(data);
          });
      });
  });


  // filter the food type when clicked on icon
  $('.food').click(function() {
    const filter = { type: $(this)['0'].id };

    return $.post('/api/widgets/', filter)
      .then((menu) => {
        renderMenu(menu);
      });
  });


  const $orderIcon = $('.orders');
  $orderIcon.click((event) => {
    event.preventDefault();

    // const data = $orderIcon.serialize();
    $.get('/api/users/orders')
      .then((data) => {
        renderVendorOrders(data);
      });
  }
  );


  loadMenu();


  // to render vendor's page
  const $vendorsMain = $('#vendors-main');

  const loadVendorOrders = (() => {
    $.ajax("/api/users/orders_todo", { method: 'GET' })
      .then(function(data) {
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
        const orders = groupProductsByOrderId(data);

        renderOrders(orders);
        $vendorsMain.prepend(`<h3>Take a Look on your orders:</h3>`);
      });
  });
});
