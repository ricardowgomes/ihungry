const renderMenu = function(menuItems) {
  // Code to work with menu items in object format to render them on client side
  $('#products').empty();
  for (const item of menuItems.menu) {
    const $itemData = createProductElement(item);
    $('#products').append($itemData);
  }
}

const createProductElement = (menuData) => {
  const $div = $('<div>').addClass('product-card').attr('id',menuData.id);
  const $img = $('<img>').attr('src',menuData.thumbnail_picture_url).attr('alt', menuData.name);
  const $span = $('<span>');
  $div.append($img, $span);
  const $div2 = $('<div2>');
  const $p2 = $('<p2>').attr('id',"price").text(menuData.price);
  $span.append($div2, $p2);
  const $h3 = $('<h3>').text(menuData.name);
  const $p = $('<p>').text(menuData.description);
  $div2.append($h3, $p);

  return $div;
};

const createProductView = (productData) => {
  // const $form = $('<form>').attr('action','/api/users/addToCart/').attr('method','POST').attr('id','add-to-cart')
  const $div = $('<div>').addClass('product-view').attr('id',productData.Id);
  // $form.append($div);
  const $img = $('<img>').attr('src', productData.image).attr('alt', productData.name);
  const $span = $('<span>');
  const $hr = $('<hr>');
  const $p = $('<p>').text(productData.description)
  const $button = $('<button>').attr('type','submit').attr('id','add-to-cart-button').text('Add to cart');
  $div.append($img,$span,$hr,$p,$button);
  const $div2 = $('<div>');
  const $p2 = $('<p>').attr('id','price').text(productData.price);
  $span.append($div2,$p2);
  const $h3 = $('<h3>').text(productData.name);
  const $p3 = $('<p2>').text(productData.name);
  $div2.append($h3,$p3);

  return $div;
};

const renderProductDetail = function(productData) {
  // Code to work with menu items in object format to render them on client side
  $('#product').empty();
  $('#product').append(createProductView(productData));
};



$(document).ready(()=>{

  // load menu from the server
  const loadMenu = (()=>{
    $.ajax("/api/users/", {method:'GET'})
      .then(function(menu){
        renderMenu(menu);
      })
  })

  $('#products').on("click",".product-card", function(){
    let productData = {};
    productData.Id = $(this)['0'].id;
    productData.image = $(this)['0'].children['0'].src;
    productData.name = $(this)['0'].children['1'].children['0'].children['0'].textContent;
    productData.description = $(this)['0'].children['1'].children['0'].children['1'].textContent;
    productData.price = $(this)['0'].children['1'].children['1'].textContent;
    renderProductDetail(productData);
    $('#product').slideDown("slow");
  })


  $('#product').on('click','#add-to-cart-button',function(){
    productId = $(this)['0'].parentElement.id;
    $.post('/api/users/addToCart/',productId,(res) =>{

    })
  })
  // $('#products').on ("click","#1", function() {
  //   console.log($(this)['0'].children['0'].src)
  //   console.log($(this)['0'].children['1'].children['0'].children['0'].textContent);
  //   console.log($(this)['0'].children['1'].children['0'].children['1'].textContent);
  //   renderProductDetail();
  //   $('#product').slideDown("slow");
  // })


  loadMenu();


})



// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/users"
//   }).done((users) => {
//     for(user of users) {
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });;
// });
