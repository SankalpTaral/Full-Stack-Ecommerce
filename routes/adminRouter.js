
import express from "express";

import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

import { userAuth } from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";

const adminRouter = express.Router();

// Admin-only routes
adminRouter.post(
  "/createProduct",
  userAuth,
  adminAuth,
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

export default adminRouter;
