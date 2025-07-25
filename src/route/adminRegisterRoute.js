const express = require("express");
const route = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const adminRegister = require("../controller/adminRegisterController");
const path =require("path")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/document");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}_${uuidv4()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

route.post("/admin_register_payment", adminRegister.adminRegisterPayment);



route.post("/admin_register_verify",adminRegister.adminRegisterVerify);


route.post("/admin_register",upload.fields([{ name: 'aadharImage', maxCount: 1 }, { name: 'panImage', maxCount: 1 }]),adminRegister.adminRegisterData)

module.exports = route;
