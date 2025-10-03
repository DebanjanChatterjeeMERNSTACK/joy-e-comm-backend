const adminRegisterSchema = require("../model/registerSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.send({
        mess: "error",
        status: 400,
        text: "Please Send The Valid Infomation",
      });
    }

    const data = await adminRegisterSchema.findOne({ email });

    if (!data) {
      return res.send({
        mess: "error",
        status: 400,
        text: "Please Register Now",
      });
    }

    const match = await bcrypt.compare(password, data.password);
    if (!match) {
      return res.send({
        mess: "error",
        status: 400,
        text: "Password Not Match",
      });
    }

    jwt.sign(
      { _id: data._id, storeName:data.storeName,address:data.address, role: data.role },
      process.env.JWTKEY,
      { expiresIn: "24h" },
      (err, token) => {
        if (err) {
          return res.send({ mess: "error", status: 400, text: err.message });
        }

        return res.send({
          mess: "success",
          status: 200,
          text: "Login Successfully",
          token,
        });
      }
    );
  } catch (err) {
    return res.send({ mess: "error", status: 400, text: err.message });
  }
};

module.exports = { adminLogin };
