import express from 'express'
import {userAuth} from '../middleware/userAuth.js';
import { getProfile } from '../controllers/user.controller.js';


const userRouter = express.Router();


userRouter.get('/profile', userAuth,getProfile)

export default userRouter