const arrOfObj = [
  {
    order_id: 1,
    product_name: 'Traditional Burger',
    product_price: '21.00',
    quantity: 1,
    prep_time: 20,
    order_created: '2021-07-27T21: 01:01.106Z',
    order_start: '2021 - 07 - 27T20: 52: 33.326Z',
    order_end: '2021 - 07 - 27T20: 52: 33.326Z'
  },
  {
    order_id: 1,
    product_name: 'Uniquely Creative Burger',
    product_price: '14.00',
    quantity: 1,
    prep_time: 20,
    order_created: '2021 - 07 - 27T21: 01: 01.106Z',
    order_start: '2021 - 07 - 27T20: 52: 33.326Z',
    order_end: '2021 - 07 - 27T20: 52: 33.326Z'
  },
  {
    order_id: 2,
    product_name: 'Macho Nacho Burger',
    product_price: '17.00',
    quantity: 2,
    prep_time: 20,
    order_created: '2021 - 07 - 27T21: 01: 01.106Z',
    order_start: '2021 - 07 - 27T20: 52: 33.326Z',
    order_end: '2021 - 07 - 27T20: 52: 33.326Z'
  },
  {
    order_id: 2,
    product_name: 'Black and Blue Burger',
    product_price: '16.80',
    quantity: 1,
    prep_time: 20,
    order_created: '2021 - 07 - 27T21: 01: 01.106Z',
    order_start: '2021 - 07 - 27T20: 52: 33.326Z',
    order_end: '2021 - 07 - 27T20: 52: 33.326Z'
  },
  {
    order_id: 3,
    product_name: 'Black and Blue Burger',
    product_price: '16.80',
    quantity: 1,
    prep_time: 20,
    order_created: '2021 - 07 - 27T21: 01: 01.106Z',
    order_start: '2021 - 07 - 27T20: 52: 33.326Z',
    order_end: '2021 - 07 - 27T20: 52: 33.326Z'
  },
  {
    order_id: 3,
    product_name: 'Macho Nacho Burger',
    product_price: '17.00',
    quantity: 1,
    prep_time: 20,
    order_created: '2021 - 07 - 27T21: 01: 01.106Z',
    order_start: '2021 - 07 - 27T20: 52: 33.326Z',
    order_end: '2021 - 07 - 27T20: 52: 33.326Z'
  }
];

const groupProductsByOrderId = (arrayOfObjects) => {
  const newObject = {};

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
    newObject[object.order_id].product_price.push(object.product_price);
    newObject[object.order_id].quantity.push(object.quantity);
    newObject[object.order_id].prep_time.push(object.prep_time);
    // newObject[object.order_id].order_created.push(object.order_created);
    // newObject[object.order_id].order_start.push(object.order_start);
    // newObject[object.order_id].order_end.push(object.order_end);
  }

  for (const key in newObject) {
    newObject[key].price_sum = newObject[key].product_price.reduce((acc, cur) => Number(acc) + Number(cur), 0);
  }

  return newObject;
};

const result = groupProductsByOrderId(arrOfObj);
console.log('>>', result);

let dateStr = '2021-07-27T21:01:01.106Z';
let formatedDate = new Date(dateStr);
console.log(formatedDate.toUTCString());
