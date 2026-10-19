
import express from 'express'

import productController from '../controllers/product.controller'


const adminRouter = express.Router()

adminRouter.post('/createProduct',productController)


export default adminRouter;