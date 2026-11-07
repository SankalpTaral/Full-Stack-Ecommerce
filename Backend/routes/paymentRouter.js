import express from "express";
import { userAuth } from "../middleware/userAuth.js";
import { createRazorpayOrder, verifyPayment } from "../controllers/payment.controller.js";

const paymentRouter = express.Router();

paymentRouter.post(
  "/create-order",
  userAuth,
  createRazorpayOrder
);


paymentRouter.post("/verify", userAuth, verifyPayment);

export default paymentRouter;
