import Cart from "../models/cart.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import { BodyOfOrderValidator } from "../validators/orderValidator.js";

export const createOrder = async (req, res, next) => {
    try {
        console.log("order controller");
  //Step 0
  const validate = BodyOfOrderValidator(req.body);

  if (validate) {
    return res.status(400).json({
      success: false,
      message: validate,
    });
  }
  console.log("After step 1")

  // Step 1
  const userId = req.user._id;

  const cart = await Cart.findOne({ userId: userId });

  // Check user has a cart or no
  if (!cart) {
    return res.status(404).json({
      success: false,
      message:
        "Cart not found. Please add products to your cart before ordering.",
    });
  }

  // Check if user has a product in his cart or no

  if(cart.items.length ===0){
      return res.status(400).json({
      success: false,
      message:
        "Cart  found. Please add products to your cart before ordering.",
    });
  }

  // i come here if user has a cart and then there are products in cart

  //Step 2:

  // fetch all productId in an array there can be mulitple so using array 
  const allProductsId = cart.items.map((items)=>{
    return items.productId;
  })

  // check those allProductId exist in the product collection all should exist 

  // design decision if user has 3 products 2 exist 1 does not then fail entire cart order

  
  // checks the product id and fetches all matching 

  // if none matches allProducts =[] if one matches allProducts = [{document 1 with product}]
  const allProducts = await Product.find({
  _id: { $in: allProductsId }
});

// SO make sure allProducts exists


if (allProducts.length !== cart.items.length) {
  return res.status(400).json({
    success: false,
    message: "One or more products in your cart no longer exist. Please update your cart.",
  });
}


// validate qty logic
for (const item of cart.items) {
  if (
    !Number.isInteger(item.quantity) ||
    item.quantity <= 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid product quantity in cart.",
    });
  }
}


// orderItems you have an array of objects of each product with latest price 

const orderItems = cart.items.map((item) => {
  const product = allProducts.find(
    (product) => product._id.toString() === item.productId.toString()
  );

  return {
    productId: product._id,
    price: product.price,
    quantity: item.quantity,
  };
});


// Step 3 Calculate total Amount 

const calculateAmount = orderItems.reduce((acc, item) => {
  return acc + item.price * item.quantity;
}, 0);


// Step 4: Create the order
const order = await Order.create({
  userId,
  items: orderItems,
  totalAmount: calculateAmount,
  shippingAddress: req.body.shippingAddress,
});

// Step 6: Clear the cart only after order creation succeeds
cart.items = [];
await cart.save();

// Step 7: Return the response
return res.status(201).json({
  success: true,
  message: "Order placed successfully",
  data: {
    orderId: order._id,
    items: order.items,
    totalAmount: order.totalAmount,
    status: order.status,
    paymentStatus: order.paymentStatus,
    shippingAddress: order.shippingAddress,
    createdAt: order.createdAt,
  },
});



    } catch (err){
        return res.status(500).json({
            message :"Internal Server Error"
        })
    }



};

/*
* If user is authenticated you will come to this createOrder fn
* Step 0 : validate the requestBody hah shipping address
* Step 1 
        * Fetch the userId from req.user._id
        * check if the user owns the cart or no 
                * if no then return please  create cart before ordering empty cart  with no products cannot be ordered
                * if user has a cart but products are empty then please add products to cart
                * if user has a cart and products in it go to step2
* Step 2 : Validate the products in the cart
        *   Does every product in the cart still exist in the product collection 
        *  Validate the quantity in user cart 
        * Get the current price from the database 
            * Why because is you added to cart yesterday price of an item was 999
            * you are buying it today price hiked 999 so read the current price
            * ❌ Don't blindly trust an old cart price.
            *  Read the product's current price from MongoDB.  
* Step 3 : Calculate total Amount
* Step 4: Create a order document decide what data goes inside it 
            * Created now save it

* Step 5 : Clear the cart 
* Step 6 :Return a response of orderCreation
*/
