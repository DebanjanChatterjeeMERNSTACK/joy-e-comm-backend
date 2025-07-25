const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, "Role Is Required."]
    },
    adminName: {
      type: String,
      required: [true, "Admin Name Is Required"],
      minlength: [3, "Admin Name Should Be At Least 3 Characters"],
      validate: {
        validator: function (value) {
          return /^[a-zA-Z0-9\s]+$/.test(value);
        },
        message: "Admin Name Must Be Alphanumeric",
      },
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
    aadharNumber: {
      type: String,
      required: [true, "Aadhar Number Is Required"],
       unique: [true, "Aadhar Number Alrady Exists"],
    },
    panNumber: {
      type: String,
      required: [true, "PAN Number Is Required"],
      unique:[true, "Pan Number Already Exists"],
    },
    aadharImage: {
      type: String,
      required: [true, "Aadhar Image Is Required"],
    },
    panImage: {
      type: String,
      required: [true, "Pan Image Is Required"],
    },
    razorpay_payment_id: {
      type: String,
      required: [true, "Payment ID Is Required"],
    },
    razorpay_order_id: {
      type: String,
      required: [true, "Order ID Is Required"],
    },
    razorpay_signature: {
      type: String,
      required: [true, "Signature Is Required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const adminRegistrationSchema = mongoose.model("admin_registration", registrationSchema);

module.exports = adminRegistrationSchema;
