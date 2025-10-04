const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      default: "admin",
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
