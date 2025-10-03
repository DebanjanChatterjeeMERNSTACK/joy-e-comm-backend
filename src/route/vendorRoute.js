const express = require("express");
const route = express.Router();
const vendor = require("../controller/vendorController");
const {authenticate,authorize}=require("../middleware/authMiddleware")


route.post("/add_vendor",authenticate,authorize(["manager","admin"]),vendor.addVendor)

route.put("/upadata_vendor/:id",authenticate,authorize(["manager","admin"]),vendor.updateVendor)

route.get("/get_vendor",authenticate,authorize(["manager","admin"]),vendor.getVendor)

route.get("/vendor_search",authenticate,authorize(["manager","admin"]),vendor.getVendorSearch)

route.delete("/delete_vendor/:id",authenticate,authorize(["manager","admin"]),vendor.deleteVendor)

module.exports = route;
