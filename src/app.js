const express =require("express")
const app =express()
require("./db/dbconnect")
const cors=require("cors")
const dotenv=require("dotenv")
const adminRegister=require("./route/adminRegisterRoute")
const adminTokenVerify=require("./route/adminTokenVerifyRoute")
const adminLogin=require("./route/adminLoginRoute")
const adminRoles=require("./route/adminRolesRoute")

dotenv.config()

app.use(express.json())
app.use(cors())

const PORT =process.env.PORT || 9000


app.use("/upload",express.static("src/document"))


app.use(adminRegister)
app.use(adminTokenVerify)
app.use(adminLogin)
app.use(adminRoles)





app.listen(PORT,()=>{
  console.log(`server connected---${PORT}`)
})