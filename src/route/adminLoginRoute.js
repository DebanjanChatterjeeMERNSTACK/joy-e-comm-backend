const express =require("express")
const route =express.Router()

const adminLogin=require("../controller/adminLoginController")

route.post("/admin_login",adminLogin.adminLogin)

module.exports=route