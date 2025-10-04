const express =require("express")
const app =express()
require("./db/dbconnect")
const cors=require("cors")
const dotenv=require("dotenv")
const Register=require("./route/registerRoute")
const Vendor =require("./route/vendorRoute")
const Login=require("./route/loginRoute")
const Product =require("./route/productRoute")
const PurchaseInvoice =require("./route/purchaseInvoiceRoute")
const CustomerInvoice =require("./route/customerInvoiceRoute")
const Customer =require("./route/customerRoute")

dotenv.config()

app.use(express.json())
app.use(cors())

const PORT =process.env.PORT 





app.use(Register)
app.use(Login)
app.use(Vendor)
app.use(Product)
app.use(PurchaseInvoice)
app.use(CustomerInvoice)
app.use(Customer)




app.listen(PORT,()=>{
  console.log(`server connected---${PORT}`)
})