import mongoose from "mongoose";
import Cart from "../models/cart.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import { BodyOfOrderValidator } from "../validators/orderValidator.js";


// This is cart method creating ordering 
export const createOrder = async (req, res, next) => {
  try {
    //Step 0
    const validate = BodyOfOrderValidator(req.body);

    if (validate) {
      return res.status(400).json({
        success: false,
        message: validate,
      });
    }
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

    if (cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cart  found. Please add products to your cart before ordering.",
      });
    }

    // i come here if user has a cart and then there are products in cart

    //Step 2:

    // fetch all productId in an array there can be mulitple so using array
    const allProductsId = cart.items.map((items) => {
      return items.productId;
    });

    // check those allProductId exist in the product collection all should exist

    // design decision if user has 3 products 2 exist 1 does not then fail entire cart order

    // checks the product id and fetches all matching

    // if none matches allProducts =[] if one matches allProducts = [{document 1 with product}]
    const allProducts = await Product.find({
      _id: { $in: allProductsId },
    });

    // MongoDB returns each product once, even if a cart has duplicate lines.
    // Validate each cart line below rather than comparing result counts.
    const productsById = new Map(
      allProducts.map((product) => [product._id.toString(), product]),
    );

    if (cart.items.some((item) => !productsById.has(item.productId.toString()))) {
      return res.status(400).json({
        success: false,
        message:
          "One or more products in your cart no longer exist. Please update your cart.",
      });
    }

    // validate qty logic
    for (const item of cart.items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid product quantity in cart.",
        });
      }

      const product = productsById.get(item.productId.toString());

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }
    }

    // orderItems you have an array of objects of each product with latest price

    const orderItems = cart.items.map((item) => {
      const product = productsById.get(item.productId.toString());

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

    // // Step 6: Clear the cart only after order creation succeeds
    // cart.items = [];
    // await cart.save();

    // Step 7: Return the response

    return res.status(201).json({
      success: true,
      message: "Order created. Proceed to payment.",
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
  } catch (err) {
    console.error("Order creation error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }

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
};

export const getAllOrders = async (req, res) => {
  try {
    const user = req.user;

    const id = user._id;

    const orderDetails = await Order.find({ userId: id }).populate(
      "items.productId",
      "name",
    );

    // find returns an empty array not null
    if (orderDetails.length === 0) {
      return res.status(404).json({
        message: "Order details not found no orders!",
      });
    }

    const data = orderDetails.map((order) => {
      return {
        orderId: order._id,
        userName: user.name,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,
        items: order.items.map((item) => {
          return {
            productId: item.productId._id,
            name: item.productId.name,
            price: item.price,
            quantity: item.quantity,
          };
        }),
      };
    });

    /*

orderDetails = 
  [
  yesterday order 
// index 0 
  {
   userId : user ka id 
   items : [
      / there can be multiple products here 
      // product 1 details here
      {
        productId : 
          name : 
          price : 
          qty: 
      }
      
      // product 2 
       {
        productId : 
          name : 
          price : 
          qty: 
      }

      // product 3 
       {
        productId : 
          name : 
          price : 
          qty: 
      }

    ] 
  }

  // index 1 

   {
   userId : user ka id 
   items : [
      / there can be multiple products here 
      // product 1 details here
      {
        productId : 
          name : 
          price : 
          qty: 
      }
      
      // product 2 
       {
        productId : 
          name : 
          price : 
          qty: 
      }

      // product 3 
       {
        productId : 
          name : 
          price : 
          qty: 
      }

    ] 
  }


  ]

*/

    return res.status(200).json({
      success: true,
      user: user.name,
      orders: data,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }

  /*
   * i get user details from userAuth middleware attach to the req object
   * i fetch user here now
   * go into orders collection check if user exist in the collection
   * if yes go forward if no no orders found please
   * if yes then print all the orders
   *  you made a problem findOne({userId : userId}) -> this brings only one order that u made
   * so you need to be carefully my mental model is
   * like u ordered one from cart -> order collection  one document created
   * you again added to cart and ordered -> one more document created
   * so for every order a new document is created remember it find(userId : userId)
   * so yesterday and today both order you will get
   * and response structure is bit nested
   */
};

export const getOrderById = async (req, res) => {
  try {
    const user = req.user;

    const orderId = req.params.orderId;

    if (!mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({
        message:
          "Order Id is params is invalid format please provide mongo db id format",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      userId: user._id,
    }).populate("items.productId", "name");

    if (!order) {
      return res.status(404).json({
        message: "No order details exist with such order id order not found ",
      });
    }

    return res.status(200).json({
      message: "Order details with that id fetched successfully",
      owner: user.name,
      order: order,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }

  /*
   * You get User Id
   * my GET order / :orderId
   * an important im creating order with cart products so it can be single or mulitple products with a single producId
   * so validate the params is he sending correct orderId or no
   * after validating check in order collection with that orderId any orderId exist
   * if not orderId then tell bad request with that no order exist
   * if yes send the order details about that orderId which all items and all
   *
   * important security vulnearbility ownership problem happend
   * anita was logged in any how anita got arjun orderId
   * she was able to see arjun orderId details that is wrong na
   * so u should always authenticate that the user sending request his userId and orderId both are correct
   * if orderId correct but userId not correct mismatch then ownership problem throw error
   */
};

export const cancelOrderById = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Step 1: Validate MongoDB ObjectId
    if (!mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({
        message: "Invalid MongoDB ObjectId",
      });
    }

    // Step 2: Find order belonging to logged-in user
    const order = await Order.findOne({
      _id: orderId,
      userId: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        message: "No such order exists",
      });
    }

    // Step 3: Check whether cancellation is allowed
    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Order cannot be cancelled",
      });
    }

    // Step 4: Update order status
    order.status = "cancelled";
    await order.save();

    // Step 5: Success response
    return res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// This is direct buy now where user will send the productId and qty and ship address

import mongoose from "mongoose";
import Product from "../models/product.js";
import Order from "../models/order.js";

export const buyNow = async (req, res) => {
  try {
    const { productId, quantity, shippingAddress } = req.body;

    // 1. Validate product ID
    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // 2. Validate quantity
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    // 3. Validate shipping address
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    // 4. Fetch product from database
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 5. Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    // 6. Calculate total using database price
    const totalAmount = product.price * quantity;

    // 7. Create order
    const order = await Order.create({
      userId: req.user._id,
      items: [
        {
          productId: product._id,
          price: product.price,
          quantity,
        },
      ],
      totalAmount,
      shippingAddress,
      status: "pending",
      paymentStatus: "pending",
    });

    // 8. Send response
    return res.status(201).json({
      success: true,
      message: "Buy Now order created successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Admin can perform this operations
export const updateOrderStatus = async (req, res) => {
  try {
    // end point PATCH /order/:orderId/status body-> {status : confirmed / shipped / delivered}
    // Step1 : check if user sending the orderId in query params is correct mongoDb format or no

    const orderId = req.params.orderId;

    if (!mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({
        message: "Invalid OrderId in params not a mongdb id type",
      });
    }

    // Step 2 : Check if orderId exist in the Order Collection

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "No orders realted with such orderId order not found !",
      });
    }

    // Step 3 : Santize the request body
    //  Check the body should contain either confirmed , shipped , delivered anything else in body will be rejected nothing else can be sent no muliple lines
    //{status :pending/confirmed/delivered} o extra things make sure admin req.body has only one key

    const body = req.body;

    const key = Object.keys(body);
    if (key.length != 1) {
      return res.status(400).json({
        message: "Invalid Body ",
      });
    }

    if (key[0] != "status") {
      return res.status(400).json({
        message: "Invalid Body ",
      });
    }

    const { status } = req.body;

    // check status fields it should be only allowed to this fields

    const allowedStatus = ["confirmed", "shipped", "delivered"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    // checked orderId checked body checkedOrder exist next now here
    // Step 4 here i come

    const statusInDb = order.status;

    if (statusInDb === "cancelled") {
      return res.status(400).json({
        message: "This order is cancelled By user u cannot update it status ",
      });
    }

    // CHECK THE FLOW IF PENDING -> CONFIRMED ACCEPTED PENDING-> DELVIERED THEN REJECT

    const statusFlow = ["pending", "confirmed", "shipped", "delivered"];

    const currentIndex = statusFlow.indexOf(statusInDb);
    const requestedIndex = statusFlow.indexOf(status);

    if (requestedIndex !== currentIndex + 1) {
      return res.status(400).json({
        message: "Invalid order status transition",
      });
    }

    // change the status and save it
    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: order,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


