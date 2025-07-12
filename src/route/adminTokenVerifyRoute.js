const express =require("express")
const route =express.Router()

const authenticate=require("../controller/adminTokenVerifyController")

route.get("/admin_token_verify",authenticate.authenticate)

module.exports=route