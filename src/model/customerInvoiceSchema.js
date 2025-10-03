const mongoose = require("mongoose");

const customerInvoiceSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "registration", // 👈 must match Admin model name
      required: true,
    },
    customerName: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    invoiceNumber: {
      type: String,
    },
    invoiceDate: {
      type: Date,
    },
    item: {
      type: Array,
    },
    totalDiscountAmount: {
      type: Number,
    },
    totalTaxAmount: {
      type: Number,
    },
    roundOff: {
      type: Number,
    },
    transportCharge:{
       type: Number,
    },
    grandTotal: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const customerInvoice = mongoose.model(
  "customerinvoice",
  customerInvoiceSchema
);

module.exports = customerInvoice;
