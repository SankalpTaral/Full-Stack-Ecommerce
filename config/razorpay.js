import dotenv from 'dotenv';
import Razorpay from "razorpay";
dotenv.config();


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


export default razorpay;



/*
 this is config file which connects our express to razorpay
 * razorpay is a configured razorpay client so when u make a request to actual
 razory paybackend razorpay.create to razorpay server razorpay word na helps in identify 
 who are you and all checks then he will validate and then allow to create 
 
 
 razorpay.js is our configuration file.



It creates a configured Razorpay client.



We import that client into our Express controllers.



When we call razorpay.orders.create(), the Razorpay SDK sends a request to Razorpay's actual server.



Razorpay checks our credentials (key_id and key_secret).



If authentication succeeds and the request is valid, Razorpay creates the order and returns its details.

*/