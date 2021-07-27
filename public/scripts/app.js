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

const renderCart = function (cartData, totalPrice) {
  $('#cart-container').empty();
  for (const item of cartData) {
    const $itemData = createCartElement(item);
    $('#cart-container').append($itemData);
  }
  $('#cart-container').append(`
    <span class='total-price'>Total price: $${totalPrice}</span>
    <form action="POST" action="/api/users/add" class='checkout'>
      <button id='checkout' type='submit'>
      checkout
      </button>
    </form>
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

const createOrderElement = (ordersData) => {
  let orderStatus = 'no status';

  if (ordersData.order_end) {
    orderStatus = `Great job! This order is finished!`;

  } else if (ordersData.order_start) {
    orderStatus = `You have until to finish this order ${ordersData.orderStart + ordersData.prepTime}`;

  } else {
    orderStatus = `Let the customer know that you are ready to start this order`;
  }

  const $vendorMain = $('<main>');
  const $orderContainer = $('<div>').attr('id', 'vendor-order-container');
  $orderContainer.append(`<span><p>#${ordersData.order_id}</p><p>${orderStatus}</p></span>
<hr>
<span>${ordersData.order_created}</span>
<span class="items-ordered"><p>${ordersData.quantity}</p><p>${ordersData.product_name}</p><p>${ordersData.product_price}</p></span>`);

  const subTotal = 20;
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
  const $div = $('#vendors-main').addClass('vendor');
  $div.empty();

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
  //filter menu based on preset filters
  $('#products').on("click", ".product-card", function () {
    const productId = { id: $(this)['0'].id };
    return $.post('/api/widgets/product_view', productId)
      .then((productData) => {
        renderProductDetail(productData.menu['0']);
        $('#product').slideDown("slow");
      });
  });

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
          totalPrice += parseInt(product.price);
        }
        renderCart(cartData, totalPrice);
      });
  });

  // GET cart information and render
  $('.shopping-cart').on('click', function () {
    loadCart();
    if ($('#cart-container').is(":hidden")) {
      $('#cart-container').slideDown("slow");
    } else if ($('#cart-container').is(":visible")) {
      $('#cart-container').slideUp("slow");
    }

  });

  //delete item from cart
  $('#cart-container').on('click', '.delete-from-cart', function () {
    const itemId = { itemid: $(this)['0'].parentElement.id };
    $.post('/api/users/shoppingCart/delete', itemId)
      .then(loadCart());
  });

  loadMenu();

  $('.food').click(function () {
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


});

