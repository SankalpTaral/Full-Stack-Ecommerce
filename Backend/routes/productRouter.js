import express from "express";
import {
  getAllProducts,
  getProduct,
} from "../controllers/product.controller.js";

const productRouter = express.Router();

productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProduct);

export default productRouter;