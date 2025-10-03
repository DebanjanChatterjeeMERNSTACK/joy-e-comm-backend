const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      default: "manager",
      enum: ["ceo", "manager", "admin"],
    },
    storeName: {
      type: String,
      required: [true, "Store Name Is Required"],
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
    password: {
      type: String,
      required: [true, "Password Is Required"],
    },
    showPassword: {
      type: String,
      required: [true, "Show Password Is Required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone Number Is Required"],
      validate: {
        validator: function (value) {
          return /^[6-9]{1}[0-9]{9}$/.test(value); // Simple 10-digit mobile pattern (India)
        },
        message: "Invalid Phone Number",
      },
    },
    address: {
      type: String,
      required: [true, "Address Is Required"],
    },
  },
  {
    timestamps: true,
  }
);

const adminRegistrationSchema = mongoose.model(
  "registration",
  registrationSchema
);

module.exports = adminRegistrationSchema;
