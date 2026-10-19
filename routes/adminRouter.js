
import express from 'express'

import { createProduct, getAllProducts  , getProduct, updateProduct} from '../controllers/product.controller.js'


const adminRouter = express.Router()

adminRouter.post('/createProduct', createProduct)

adminRouter.get('/getAllProducts', getAllProducts)

adminRouter.get('/getProduct/:id' , getProduct)

adminRouter.patch('/updateProduct/:id' , updateProduct)
export default adminRouter;
