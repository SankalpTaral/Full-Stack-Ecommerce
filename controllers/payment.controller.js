import Order from "../models/order.js";
import Payment from "../models/payment.js";
import crypto from "crypto";
import Product from "../models/product.js";
import Cart from "../models/cart.js";

export const createPayment = async (req, res) => {
  const userId = req.user._id;

  const { orderId } = req.body;

  // Step 1 Check if orderId exist or no for the user is paying &&   Verify order ownership also

  const order = await Order.findOne({
    userId: userId,
    _id: orderId,
  });

  if (!order) {
    return res.status(404).json({
      message: "Order not found ",
    });
  }

  if (order.paymentStatus === "confirmed") {
    return res.status(400).json({
      message: "Payment is already done for this  ",
    });
  }

  if (order.status === "cancelled") {
    return res.status(400).json({
      message: "Cannot pay for a cancelled order",
    });
  }

  const transactionId = crypto.randomUUID();

  const payment = await Payment.create({
    orderId: order._id,
    userId,
    amount: order.totalAmount,
    status: "pending",
    paymentMethod: "mock",
    transactionId,
  });

  return res.status(201).json({
    message: "Payment initiated successfully",
    payment: {
      paymentId: payment._id,
      transactionId: payment.transactionId,
      amount: payment.amount,
      status: payment.status,
      paymentMethod: payment.paymentMethod,
    },
  });
};

export const processMockPayment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { paymentId } = req.params;
    const { outcome } = req.body;

    // 1. Validate payment outcome
    if (!["success", "failed"].includes(outcome)) {
      return res.status(400).json({
        message: "Invalid payment outcome",
      });
    }

    // 2. Find payment belonging to logged-in user
    const payment = await Payment.findOne({
      _id: paymentId,
      userId,
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    // 3. Prevent processing the same payment twice
    if (payment.status !== "pending") {
      return res.status(400).json({
        message: "Payment has already been processed",
      });
    }

    // 4. Find the associated order
    const order = await Order.findOne({
      _id: payment.orderId,
      userId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // 5. Update payment status
    payment.status = outcome;
    await payment.save();

    // 6. If payment succeeds, confirm the order
    if (outcome === "success") {
      order.paymentStatus = "confirmed";
      order.status = "confirmed";

      await order.save();

      // Deduct product stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: {
            stock: -item.quantity,
          },
        });
      }

      // Clear user's cart
      await Cart.findOneAndUpdate(
        { userId },
        {
          $set: { items: [] },
        },
      );
    }

    // 7. Send response
    return res.status(200).json({
      message: outcome === "success" ? "Payment successful" : "Payment failed",

      payment: {
        paymentId: payment._id,
        transactionId: payment.transactionId,
        amount: payment.amount,
        status: payment.status,
      },

      order: {
        orderId: order._id,
        status: order.status,
        paymentStatus: order.paymentStatus,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
