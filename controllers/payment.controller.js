
import Order from "../models/order.js";
import razorpay from "../config/razorpay.js";
import crypto from "crypto";



export const createRazorpayOrder = async (req, res) => {
  try {
    // Step 1: Get MongoDB Order ID
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Step 2: Find the order belonging to the logged-in user
    const order = await Order.findOne({
      _id: orderId,
      userId: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Step 3: Check payment status
    if (order.paymentStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Payment is not pending for this order",
      });
    }

    // Step 4: Check if a Razorpay Order already exists
    if (order.razorpayOrderId) {
      return res.status(200).json({
        success: true,
        message: "Razorpay order already exists",
        data: {
          razorpayOrderId: order.razorpayOrderId,
          amount: order.totalAmount * 100,
          currency: "INR",
          keyId: process.env.RAZORPAY_KEY_ID,
          mongoOrderId: order._id,
        },
      });
    }

    // Step 5: Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.totalAmount * 100),
      currency: "INR",
      receipt: order._id.toString(),
    });

    // Step 6: Save Razorpay Order ID in MongoDB
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    // Step 7: Send response
    return res.status(201).json({
      success: true,
      message: "Razorpay order created successfully",
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        mongoOrderId: order._id,
      },
    });
  } catch (err) {
    console.error("Razorpay order creation error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
    });
  }
};
export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature
        } = req.body;

        // 1. Validate request data
        if (
            !razorpay_payment_id ||
            !razorpay_order_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment details are required"
            });
        }

        // 2. Find the corresponding MongoDB order
        const order = await Order.findOne({
            razorpayOrderId: razorpay_order_id,
            userId: req.user._id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // 3. Generate signature on the backend
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        // 4. Compare Razorpay signature with generated signature
        const signatureBuffer = Buffer.from(razorpay_signature, "hex");
        const generatedBuffer = Buffer.from(generatedSignature, "hex");

        const isValid =
            signatureBuffer.length === generatedBuffer.length &&
            crypto.timingSafeEqual(signatureBuffer, generatedBuffer);

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });
        }

        // 5. Update order after successful verification
        order.razorpayPaymentId = razorpay_payment_id;
        order.paymentStatus = "confirmed";
        order.status = "confirmed";

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            data: order
        });

    } catch (error) {
        console.error("Payment verification error:", error);

        return res.status(500).json({
            success: false,
            message: "Payment verification failed"
        });
    }
};