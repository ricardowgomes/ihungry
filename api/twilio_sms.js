//
// run npm install twilio if you haven't
//

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
// const resturantNumber = process.env.RESTAURANT_NUMBER;
// const customerNumber = process.env.CUSTOMER_NUMBER;

const twilio = require('twilio')(accountSid, authToken);


// message to user when submit button is triggered
twilio.messages
  .create({
     body:
      `Thank you, Andy's taking care of your order now.
      See you in 20!
      🎉 🍔 🎉`,
     from: twilioNumber,
     to: '+15558675310' // hardcode personal number for testing --> then run node twilio_sms.js
   })
// .then(message => console.log(message.sid));


// message to restaurant with order details
twilio.messages
  .create({
     body:
      `New order received: ...`,
     from: twilioNumber,
     to: '+15558675310'
   })
