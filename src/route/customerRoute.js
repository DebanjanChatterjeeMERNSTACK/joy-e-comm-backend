
const express = require("express");
const route = express.Router();
const customer = require("../controller/customerController");
const {authenticate,authorize}=require("../middleware/authMiddleware")

route.get("/get_customer",authenticate,authorize(["manager","admin"]),customer.getCustomer);

module.exports = route;