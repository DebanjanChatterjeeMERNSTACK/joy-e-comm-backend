const express =require("express")
const route =express.Router()

const adminLogin=require("../controller/loginController")

route.post("/admin_login",adminLogin.adminLogin)

module.exports=route