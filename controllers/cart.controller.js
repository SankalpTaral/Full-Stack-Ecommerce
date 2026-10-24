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
    });

    // if cart contains document meaning user has a cart already
    // cart is null then meaning that user does not have cart

    // Case 1 : If user does not have cart
    // create a cart and add the productId which he sent
    if (!cart) {
      const newCart = await Cart.create({
        userId: req.user._id,
        items: [
          {
            productId: productId,
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

      cart.populate("items.productId", "name price");

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

export const getCartDetails = async (req, res) => {
  // go the user Id
  try {
    const userId = req.user._id;

    const checkUserInCart = await Cart.findOne({
      userId: req.user._id,
    }).populate("items.productId", "name price");

    if (!checkUserInCart) {
      return res.status(404).json({
        message: "Cart is empty please add products to cart",
      });
    }

    //Here i come if user exist in cart documents fetch his cart details and send response

    return res.status(200).json({
      success: true,
      cartOwner: req.user.name,
      items: checkUserInCart.items.map((item) => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity,
      })),
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateCart = async (req, res) => {
  // endpoint /cart/:productId in body user will send  ex : {quantity : 5 }

  const user = req.user;

  console.log(user);

  //Step 1 : Validate the id he is passing in query params is it valid mongodb type or no

  const checkQueryParam = req.params.productId;

  if (!mongoose.isValidObjectId(checkQueryParam)) {
    return res.status(400).json({
      message: " Id is not a valid mongoDb id type ur passing in parameters",
    });
  }

  //Step 2: Validate the quantity as of now add how many he wants not related to stock
  // but make sure quantity is a number only no string no 12ab no fraction

  const validateBody = req.body;

  // allow only to send quantity no other words he should send

  const test = Object.keys(validateBody);

  if (test.length !== 1 || test[0] !== "quantity") {
    return res.status(400).json({
      message: "invalid body paramter",
    });
  }

  // Here i come if user has send one parameter and that parameter is body

  // Now here check the value value should be postive integer not an random number

  const quantityValue = Number(req.body.quantity);

  if (!Number.isInteger(quantityValue) || quantityValue < 1) {
    return res.status(400).json({
      message: "Quantity must be a positive integer",
    });
  }

  // user has passed valid productId of mongotype body is correct

  // Check wheter the params request productId exist in product collection

  const product = await Product.findById(req.params.productId);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  // Check if user is present in the cart ? if present in the cart check if the productId which he is sending  is present in his userCart if yes then increase the quantity

  // Case 2: user is already owns the cart but productId is missing so go and add the product in user cart

  const checkUserExistInCart = await  Cart.findOne({ userId: req.user._id });

  if (checkUserExistInCart) {
    const findProductInUserCart = checkUserExistInCart.items.find((item) => {
      return item.productId.toString() === req.params.productId.toString();
    });

    if (findProductInUserCart) {
      findProductInUserCart.quantity += quantityValue;

      
       await checkUserExistInCart.populate("items.productId" , "name price");
      await checkUserExistInCart.save();

      return res.status(200).json({
        message : "product already existed in cart so incremented its quantity by given value in request body",
        cartOwner : req.user.name,
        cart : checkUserExistInCart,
      })
    } else {
      // i come here if user owns a cart but product he does not have so go and create a product and set its qty
   
      const addProductToUserCart = checkUserExistInCart;
      // you get the userCart document here go and add it in the items  and set the quantity

      addProductToUserCart.items.push({
        productId: req.params.productId,
        quantity: quantityValue,
      });

      await addProductToUserCart.populate("items.productId" , "name price");
      // NEED TO SAVE 
      await addProductToUserCart.save();

      return res.status(201).json({
        message : "User had cart but did not have the product so created a product and setted its quantity as u provided",
        cartOwner : req.user.name ,
        cart :addProductToUserCart


      })
    }
  } else {
    // you come in this block if user does not have own a cart only his cart is empty
    // so create a cart with his userId and add product and set the qty he is sending

    const newCart = await Cart.create({
      userId : req.user._id,
      items : [
       {
        productId : req.params.productId,
        quantity : quantityValue
       }
      ]
    })
    await newCart.populate("items.productId" , "name price");


    return res.status(201).json({
      message : "User did not have an cart so created a cart in that added a product he sent and setted the quantity",
      cartOwner : req.user.name ,
      cartDetails : newCart
    })
  }
};

export const deleteProductInCart = async (req,res)=>{
  try{
    console.log("yooo");

    if(!mongoose.isValidObjectId(req.params.productId)){
        return res.status(400).json({
          message :"invalid product id in query parameters not a valid mongodb id "
        })
    }

    const product = await Product.findById(req.params.productId);

    if(!product){
        return res.status(404).json({
          message : "Product not found"
        })
    }

    const cart = await Cart.findOne({userId:req.user._id})

    console.log(cart);

    if(!cart){
        return res.status(404).json({
          message : "User does not have a cart only from where he will delete product own a cart first add item in it then u can delete a product"
        })
    }

    const checkProductExistenceInUserCart = cart.items.find((item)=>{
      return item.productId.toString() === req.params.productId.toString();
    })

    if(!checkProductExistenceInUserCart){
      return res.status(404).json({
          message : "User has a cart but in that cart product id ur giving that is not present so he cannot perfrom delete operation if product does not exist in his cart "
        })
    }
    
    console.log(checkProductExistenceInUserCart._id);

    
  
    const updatedCartItems = cart.items.filter((item) => {
  return item.productId.toString() !== req.params.productId.toString();
});

    cart.items = updatedCartItems; // REPLACES THE EXISTING WITH NEW 
    await cart.populate("items.productId" , "name price");
    await cart.save();

    return res.status(200).json({
      success : true,
      message : "Product deleted from ur Cart successfully",
      cartOwner : req.user.name,
      cart  : cart
    })

    

  }catch(err){
      return res.status(500).json({
        message : "Internal server error"
      })
  }
}

export const clearCart = async (req,res)=>{
  
  /*
  * User is authenticated 
  * Sanitize 
  * Check if user has a cart to delete or  no (check user has cart if yes continue else user do not have a cart cannot perfrom deletion before creation)
  * user has a cart 
  * okay the find user with the cart and just clear the cart 
  */

  try{
  const user = req.user;

  if(req.body !== undefined){
    return res.status(400).json({
      message : "Not allowed to send a body "
    })
  }

  const checkUserhasCart = await Cart.findOne({userId : user._id});

  if(!checkUserhasCart){
       return res.status(404).json({
      message : "user do not have a cart cannot perfrom deletion before creation"
    })
  }

  // user has a cart lets clean up the cart and make it empty

  // Design decison we will not delete it from mongodb collection just make the items empty
  checkUserhasCart.items = [];

  await checkUserhasCart.save();

  return res.status(200).json({
    success : true,
    message : "Cart cleared succesfully",
    cartOwner : req.user.name,
    cartDetails : checkUserhasCart
  })
}catch(err){
  return res.status(500).json({
    message : "Internal server error"
  })
}

}

/*
Create an api to delete a product from user cart
* end point /cart/:productId 
* Step 1 run userAuth middleware 
* step 2 : check if productId is valid mongoDb , check such product in our product collection , 
*           check if user has a cart , if user has cart check if he has a product 
*           if user does not have a cart then he cannot delete thats quite obvious
*         if user has a cart then he does not have a product then tell product doesnt exist in the cart to be deleted
* 
*/