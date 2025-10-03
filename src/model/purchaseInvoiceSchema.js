const { number } = require("joi");
const mongoose = require("mongoose");

const purchaseInvoiceSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "registration", // 👈 must match Admin model name
      required: true,
    },
    companyName:{
       type:String
    },
     email:{
       type:String
    },
     phoneNumber:{
       type:String
    },
     address:{
       type:String
    },
     gstNumber:{
       type:String
    },
    invoiceNumber:{
      type:String
    },
    invoiceDate:{
     type:Date
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
    transportCharge:{
      type:Number
    },
    roundOff: {
      type: Number,
    },
    grandTotal: {
      type: Number,
    },
    // productName: {
    //   type: String ,
    //   uppercase: true
    // },
    // units: { type: String },
    // quantity: { type: Number },
    // stock:{type: Number},
    // purchesPrice: { type: Number },
    // gst: { type: Number },
    // taxAmount: { type: Number },
    // discountPercent:{type:Number },
    // discount: { type: Number },
    // amount: { type: Number },
  },
  {
    timestamps: true,
  }
);

const purchaseInvoice = mongoose.model(
  "purchaseinvoice",
  purchaseInvoiceSchema
);

module.exports = purchaseInvoice;
