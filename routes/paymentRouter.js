import express from "express";
import {
    createPayment,
    processMockPayment
} from "../controllers/payment.controller.js";

import { userAuth } from "../middleware/userAuth.js";

const paymentRouter= express.Router();

paymentRouter.post("/create", userAuth, createPayment);

paymentRouter.post(
    "/:paymentId/process",
    userAuth,
    processMockPayment
);

export default paymentRouter;