const adminRegisterSchema = require("../model/adminRegisterSchema");
const bcrypt = require("bcrypt");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_ID, // the email you used to create app password
    pass: process.env.MAIL_APP_PASSWORD, // your generated app password
  },
});

const adminRegisterData = async (req, res) => {
  const {
    adminName,
    email,
    password,
    phoneNumber,
    aadharNumber,
    panNumber,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
  } = req.body;
  const aadharImageData = req.files[aadharImage][0].filename;
  const panImageData = req.files[panImage][0].filename;
  try {
    const aadharImage = `${process.env.URL}/upload/${aadharImageData}`;
    const panImage = `${process.env.URL}/upload/${panImageData}`;

    const mailOptions = {
      from: process.env.MAIL_ID, // sender address
      to: `${email}`, // list of receivers
      subject: "Hello", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    };

    if (!adminName || !email || !password || !phoneNumber|| !aadharNumber ||  !panNumber) { 
        return res.send({
        mess: "error",
        status: 400,
        text: "Please Fill All Filed",
      });
    }


      const user = await adminRegisterSchema.findOne({ email: email });
      if (user) {
        return res.send({
          mess: "error",
          status: 400,
          text: "Already Register",
        });
      } 


        const saltRounds = 10;
        const hass_password = await bcrypt.hash(password, saltRounds);
        const data = await adminRegisterSchema({
          adminName: adminName,
          email: email,
          password: hass_password,
          aadharImage: aadharImage,
          panImage: panImage,
          phoneNumber: phoneNumber,
          aadharNumber: aadharNumber,
          panNumber: panNumber,
          razorpay_payment_id: razorpay_payment_id,
          razorpay_order_id: razorpay_order_id,
          razorpay_signature: razorpay_signature,
        });
        data.save().then(() => {
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return res.send({
                mess: "error",
                status: 400,
                text: error.message,
              });
            } else {
              return res.send({
                mess: "success",
                status: 200,
                text: "Register Complete",
                data: info,
              });
            }
          });
        });
      
    
  } catch (err) {
    return res.send({ mess: "error", status: 400, text: err.message });
  }
};

const adminRegisterPayment = async (req, res) => {
  const { amount } = req.body;

  if(amount < 100){
    return  res.send({ mess: "error", status: 400, text: "Your Payment Value Is Wrong" });
  }

  let instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  var options = {
    amount: amount * 100,
    currency: "INR",
  };

  instance.orders.create(options, function (err, value) {
    if (err) {
      return res.send({ mess: "error", status: 400, text: err.message });
    }
    return res.send({
      mess: "success",
      status: 200,
      data: value,
      text: "Order Created",
    });
  });
};

const adminRegisterVerify = async (req, res) => {
  try {
    const { razorpay_orderID, razorpay_paymentID, razorpay_signature, email } =
      req.body;

    if (!email) {
      return res.send({
        mess: "error",
        status: 400,
        text: "Please Send The Email",
      });
    }
    const data = await adminRegisterSchema.findOne({ email: email });
    if (data) {
      return res.send({
        mess: "error",
        status: 400,
        text: "Email All Ready Register",
      });
    }

    const sign = razorpay_orderID + "|" + razorpay_paymentID;

    const resultSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature == resultSign) {
      return res.send({
        mess: "success",
        status: 200,
        text: "Payment Successfully",
        data: {
          razorpay_orderID,
          razorpay_paymentID,
          razorpay_signature,
        },
      });
    }
  } catch (err) {
    console.log(err);
    return res.send({ mess: "error", status: 400, text: err.message });
  }
};

module.exports = {
  adminRegisterData,
  adminRegisterVerify,
  adminRegisterPayment,
};
