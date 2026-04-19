const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        title: String,
        price: Number,
        quantity: Number,
        image: String
      }
    ],
    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      pincode: String
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "Card"],
      default: "COD"
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending"
    },
    orderStatus: {
      type: String,
      enum: [
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled"
      ],
      default: "Processing"
    },
    totalAmount: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Order", orderSchema);