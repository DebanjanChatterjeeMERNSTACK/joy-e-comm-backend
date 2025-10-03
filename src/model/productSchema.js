
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "registration", // 👈 must match Admin model name
      required: true,
    },
    productName: { 
      type: String ,
      uppercase: true
    },
    units: { type: String },
    quantity: { type: Number },
    stock:{type: Number},
    purchesPrice: { type: Number },
    gst: { type: Number },
    taxAmount: { type: Number },
    discountPercent:{type:Number },
    discount: { type: Number },
    amount: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("product", productSchema);

module.exports = Product;
