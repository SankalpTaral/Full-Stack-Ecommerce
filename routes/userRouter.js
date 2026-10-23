import express from 'express'
import {userAuth} from '../middleware/userAuth.js';
import { getProfile } from '../controllers/user.controller.js';
import { addToCart } from '../controllers/cart.controller.js';


const userRouter = express.Router();


userRouter.get('/profile', userAuth,getProfile)


userRouter.post('/cart', userAuth ,addToCart)

export default userRouter