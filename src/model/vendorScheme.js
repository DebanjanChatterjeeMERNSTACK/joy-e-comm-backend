const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "registration", // 👈 must match your Admin model name
      required: true,
    },
    companyName: {
      type: String,
      required: [true, "Company Name Is Required"],
    },
    email: {
      type: String,
      required: [true, "Email Is Required"],
      unique: true,
      validate: {
        validator: function (value) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
        },
        message: "Invalid Email Address",
      },
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone Number Is Required"],
    },
    address: {
      type: String,
      required: [true, "Address Is Required"],
    },
    gstNumber: {
      type: String,
      required: [true, "GST Number Is Required"],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const vendorschema = mongoose.model("vendor", vendorSchema);

module.exports = vendorschema;
