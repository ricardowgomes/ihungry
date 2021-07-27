const renderMenu = function (menuItems) {
  // Code to work with menu items in object format to render them on client side
  $('#products').empty();
  for (const item of menuItems.menu) {
    const $itemData = createProductElement(item);
    $('#products').append($itemData);
  }
};

const createProductElement = (menuData) => {
  const $div = $('<div>').addClass('product-card');
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

const createOrderElement = (ordersData) => {
  let orderStatus = 'no status';
  if (ordersData.orderEnd) {
    orderStatus = `Great job! This order is finished!`;

  } else if (ordersData.orderStart) {
    orderStatus = `You have until to finish this order ${ordersData.orderStart + ordersData.prepTime}`;

  } else {
    orderStatus = `Let the customer know that you are ready to start this order`;
  }

  const $vendorMain = $('<main>');
  const $orderContainer = $('<div>').attr('id', 'vendor-order-container');
  $orderContainer.append(`<span><p>#${ordersData.orderId}</p><p>${orderStatus}</p></span>
  <hr>
  <span>${ordersData.orderCreated}</span>
  <span class="items-ordered"><p>${ordersData.quantity}</p><p>${ordersData.name}</p><p>${ordersData.price}</p></span>`);

  const subTotal = ordersData.sum_of_order;
  const totals = `
  <span><p>Subtotal</p><p>$${subTotal}</p></span>
  <hr>
  <span><p>Delivery</p><p>Pickup</p></span>
  <span><p>GST (5%)</p><p>$${subTotal * 0.05}</p></span><span>
  <p>Total (CAD)</p><p> $${subTotal * 0.05 + subTotal}</p></span>`;
  $orderContainer.append(totals);

  $vendorMain.append($orderContainer);

  return $vendorMain;
};

const renderVendorOrders = (orders) => {
  $('#vendors-main').empty();
  for (const item of orders) {
    const $itemData = createOrderElement(item);
    $('#vendors-main').append($itemData);
  }
};

$(document).ready(() => {
  // load menu from the server
  const loadMenu = (() => {
    $.ajax("/api/users/", { method: 'GET' })
      .then(function (menu) {
        renderMenu(menu);
      });
  });
  loadMenu();

  $('.food').click(function () {
    const filter = { type: $(this)['0'].id };

    return $.post('/api/widgets/', filter)
      .then((menu) => {
        console.log(menu);
        renderMenu(menu);
      });
  });

  // const loadOrders = (() => {
  //   $.ajax("/api/users/", { method: 'GET' })
  //     .then(function (menu) {
  //       renderMenu(menu);
  //     });
  // });
  // loadMenu();
});
