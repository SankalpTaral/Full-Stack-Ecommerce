import mongoose from "mongoose";
import Product from "../models/product.js";
import Cart from "../models/cart.js";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    /* Step 1: Validate reqBody

* If user does not send productId in body then it will be treated as undefined -> !undefined !true
* the productId should be mongoDb valid id not a random id
* mongoose.Types.ObjectId.isValid(productId) checks it returns true if its an validId
* so we are reversing it if it returns false  meaning the id is not valid
* then we convert it to true and make it go in if block and return the response 
* product id is invalid 

*/
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Step 2 Check if productId which is sent exist in ur database of product or no

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    /*
Step 3 — Find the user's cart
Think about what should happen now.
- If the user already has a cart, we should use that cart.
- If the user doesn't have a cart yet, we need to create one.
*/

    const cart = await Cart.findOne({
      userId: req.user._id,
    })

   
    // if cart contains document meaning user has a cart already
    // cart is null then meaning that user does not have cart

    // Case 1 : If user does not have cart
    // create a cart and add the productId which he sent
    if (!cart) {
      const newCart = await Cart.create({
        userId: req.user._id,
        items: [
          {
            productId:productId,
            quantity: 1,
          },
        ],
      });

       await newCart.populate("items.productId", "name price");


      return res.status(201).json({
        success: true,
        cartOwner: req.user.name,
        message: "Product added to cart successfully",
        cart: newCart,
      });
    }

    // Case 2: If user has a cart already
    // check in his cart that productId which he is trying to add exist or no in his cart
    // if it exist in his cart increase quantity it it does not exist in his cart add it set qty as 1
    else {
      const existingItem = cart.items.find((item) => {
        return item.productId.toString() === productId.toString();
      });
      // exisiting item if found = it returns an matching object in items array  not entire document 

      // . find returns the exisiting Item {productId : id and the quantity : }
      // if exist go and increase the qty
      // if existingItem does not find anything means that product does not exist in cart
      // so create a new product in user cart ka items push it id and quantity

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({
          productId,
          quantity: 1,
        });
      }

      cart.populate("items.productId","name price");

      await cart.save();
    }

    return res.status(200).json({
      success: true,
      cartOwner: req.user.name,
      message: "Product added to cart successfully",
      cart: cart,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


