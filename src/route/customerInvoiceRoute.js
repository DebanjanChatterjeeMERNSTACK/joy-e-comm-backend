const express = require("express");
const router = express.Router();
const customerInvoice = require("../controller/customerInvoiceController");
const {authenticate,authorize}=require("../middleware/authMiddleware")
// CRUD Routes

router.post("/add_customerinvoice",authenticate,authorize(["manager","admin"]), customerInvoice.createcustomerInvoice);
router.get("/get_customerinvoice",authenticate,authorize(["manager","admin"]), customerInvoice.getCustomerInvoices);
router.put("/update_customerinvoice/:id",authenticate,authorize(["manager","admin"]), customerInvoice.editCustomerInvoice);
// router.delete("/delete_product/:id",authenticate,authorize(["manager","admin"]), productController.deleteProduct);

module.exports = router;
