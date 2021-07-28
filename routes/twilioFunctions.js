//
// run npm install twilio if you haven't
//
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
// const resturantNumber = process.env.RESTAURANT_NUMBER;
// const customerNumber = process.env.CUSTOMER_NUMBER;

const twilio = require('twilio')(accountSid, authToken);

// message to user when submit button is triggered
const messageCustomer = (customer) => {
  const text = `Hi ${customer}, your order from iHungry will be ready in 20 minutes!`;

  twilio.messages
    .create({
       body: text,
       from: twilioNumber,
       to: '+15877836295'
     })
    .then(message => console.log(message.sid));

};


// message to restaurant with order details
const messageRestaurant = (orderId, customer) => {
  const text = `New order number ${orderId} received from ${customer}`;
  twilio.messages
    .create({
       body: text,
       from: twilioNumber,
       to: '+15877836295'
     })
};

const messageOrderReady = (customer) => {
  const text = `Your order is ready for pickup ${customer}!`;
  twilio.messages
    .create({
       body: text,
       from: twilioNumber,
       to: '+15877836295'
     })

};


  //  twilio.calls
  //  .create({
  //     url: 'http://demo.twilio.com/docs/voice.xml',
  //     to: '+15877836295',
  //     from: twilioNumber
  //   })
  //  .then(call => console.log(call.sid));
module.exports = { messageCustomer, messageRestaurant, messageOrderReady};
