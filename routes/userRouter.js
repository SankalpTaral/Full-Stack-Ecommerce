import express from 'express'
import {userAuth} from '../middleware/userAuth.js';
import { getProfile } from '../controllers/user.controller.js';
import { addToCart,deleteProductInCart,getCartDetails ,updateCart} from '../controllers/cart.controller.js';


const userRouter = express.Router();


userRouter.get('/profile', userAuth,getProfile)

userRouter.get('/cart',userAuth,getCartDetails)

userRouter.post('/cart', userAuth ,addToCart)

userRouter.patch('/cart/:productId',userAuth, updateCart)

userRouter.delete('/cart/:productId',userAuth, deleteProductInCart)

export default userRouter