
import express from "express";
import upload from "../config/multer.js";

import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

import { userAuth } from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";
import { updateOrderStatus } from "../controllers/order.controller.js";

const adminRouter = express.Router();

// Admin-only routes
adminRouter.post(
  "/createProduct",
  userAuth,
  adminAuth,
   upload.single("image"), // multer will go and attach image 
  createProduct
);

adminRouter.patch(
  "/updateProduct/:id",
  userAuth,
  adminAuth,
  updateProduct
);

adminRouter.delete(
  "/deleteProduct/:id",
  userAuth,
  adminAuth,
  deleteProduct
);


adminRouter.patch(
  "/order/:orderId/status",
  userAuth,
  adminAuth,
  updateOrderStatus
)

export default adminRouter;
