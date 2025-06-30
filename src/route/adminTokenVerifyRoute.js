const express =require("express")
const route =express.Router()

const authenticate=require("../controller/adminTokenVerifyController")

route.post("/admin_token_verify",authenticate.authenticate)

module.exports=route