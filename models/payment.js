import mongoose from "mongoose";
import { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Order",
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      required: true,
      enum: ["mock", "card", "upi"],
    },

    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment