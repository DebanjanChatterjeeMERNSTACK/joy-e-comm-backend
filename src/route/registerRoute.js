const express = require("express");
const route = express.Router();
const Register = require("../controller/registerController");
const {authenticate,authorize}=require("../middleware/authMiddleware")


route.post("/add_register",authenticate,authorize(["ceo"]),Register.addRegisterData)

route.put("/upadata_register/:id",authenticate,authorize(["ceo"]),Register.updateRegisterData)

route.get("/get_register",authenticate,authorize(["ceo"]),Register.getRegisterData)

route.delete("/delete_register/:id",authenticate,authorize(["ceo"]),Register.deleteRegisterData)

// route.post("/admin_forgetpassword" ,Register.adminForgetpassword)

// route.post("/admin_resetpassword/:id" ,Register.adminResetpassword)

module.exports = route;
