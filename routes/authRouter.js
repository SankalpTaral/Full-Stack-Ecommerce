import express from 'express'
import { createUser } from '../controllers/auth.controller.js'

const authRouter = express.Router();

authRouter.post('/signup', createUser)

export default authRouter