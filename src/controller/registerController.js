const registerSchema = require("../model/registerSchema");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();


const addRegisterData = async (req, res) => {
  const { storeName, email, password, phoneNumber, address } = req.body;

  try {
    if (!email || !password || !phoneNumber || !address || !storeName) {
      return res.send({
        mess: "error",
        status: 400,
        text: "Please Fill All Filed",
      });
    }

    const user = await registerSchema.findOne({ email: email });
    if (user) {
      return res.send({
        mess: "error",
        status: 400,
        text: "Already Register",
      });
    }

    const saltRounds = 10;
    const hass_password = await bcrypt.hash(password, saltRounds);
    const data = await registerSchema({
      email: email,
      password: hass_password,
      showPassword: password,
      phoneNumber: phoneNumber,
      address: address,
      storeName: storeName,
    });
    data.save().then(() => {
      return res.send({
        mess: "success",
        status: 200,
        text: "Register Complete",
      });
    });
  } catch (err) {
    return res.send({ mess: "error", status: 400, text: err.message });
  }
};

const updateRegisterData = async (req, res) => {
  try {
    const id = req.params.id;
    const { storeName, email, password, phoneNumber, address } = req.body;
    const saltRounds = 10;
    const hass_password = await bcrypt.hash(password, saltRounds);
    const updateData = await registerSchema.findOneAndUpdate(
      { _id: id },
      {
        storeName,
        email,
        password: hass_password,
        showPassword: password,
        phoneNumber,
        address,
      }
    );

    if (updateData) {
      return res.send({
        mess: "success",
        status: 200,
        text: "Update Successfully",
      });
    } else {
      return res.send({
        mess: "success",
        status: 400,
        text: "Update Is Not Successfully",
      });
    }
  } catch (err) {
    return res.send({
      mess: "error",
      status: 400,
      text: err.message,
    });
  }
};

const getRegisterData = async (req, res) => {
  try {
    // Query params
    const { search, page = 1, limit } = req.query;

    // 1️⃣ Build query
    let query = {};

    if (search) {
      query.$or = [
        { storeName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ];
    }

    // 2️⃣ Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // 3️⃣ Fetch vendors
    const vendors = await registerSchema
      .find(query)
      .skip(skip)
      .limit(Number(limit));

    const totalCount = await registerSchema.countDocuments(query);

    return res.send({
      mess: "success",
      status: 200,
      text: "Store fetched successfully",
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      page: Number(page),
      limit: Number(limit),
      data: vendors,
    });
  } catch (err) {
    return res.send({
      mess: "error",
      status: 400,
      text: err.message,
    });
  }
};

const deleteRegisterData = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await registerSchema.findOneAndDelete(
      { _id: id },
      { _id: id }
    );
    if (data) {
      return res.send({
        mess: "success",
        status: 200,
        text: "Delete Successfully",
      });
    }
  } catch (err) {
    return res.send({
      mess: "error",
      status: 400,
      text: err.message,
    });
  }
};

const adminForgetpassword = async (req, res) => {
  try {
    const email = req.body.email;
    const data = await registerSchema.findOne({ email: email });

    if (data) {
      const mailOptions = {
        from: process.env.MAIL_ID, // sender address
        to: email, // recipient email
        subject: "Reset Password", // subject line
        text: "Please use the following link to reset your password.", // plain text body
        html: `<p>Click the link below to reset your password:</p>
         <a href="${process.env.FONTEND_URL}/resetpassword/${data._id}">Reset Password</a>`, // proper HTML body
      };

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
            text: "Check Your Mail To Change Your Password",
          });
        }
      });
    } else {
      return res.send({
        mess: "error",
        status: 400,
        text: "Email Not Match",
      });
    }
  } catch (err) {
    return res.send({
      mess: "error",
      status: 400,
      text: err.message,
    });
  }
};

const adminResetpassword = async (req, res) => {
  try {
    const id = req.params.id;
    const { password, confirmPassword } = req.body;

    const data = await registerSchema.findOne({ _id: id });

    if (!data) {
      return res.send({
        mess: "error",
        status: 400,
        text: "Id Not Match",
      });
    }

    if (password !== confirmPassword) {
      return res.send({
        mess: "error",
        status: 400,
        text: "Password Not Match",
      });
    }
    const saltRounds = 10;
    const hass_password = await bcrypt.hash(password, saltRounds);
    const update = await registerSchema.findOneAndUpdate(
      { _id: id },
      { password: hass_password }
    );

    if (update) {
      return res.send({
        mess: "success",
        status: 200,
        text: "Password Reset Successfully",
      });
    }
  } catch (err) {
    return res.send({
      mess: "error",
      status: 400,
      text: err.message,
    });
  }
};

module.exports = {
  addRegisterData,
  adminForgetpassword,
  updateRegisterData,
  getRegisterData,
  deleteRegisterData,
  adminResetpassword,
};
