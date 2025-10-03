const express = require("express");
const router = express.Router();
const purchaseInvoice = require("../controller/purchaseInvoiceController");
const {authenticate,authorize}=require("../middleware/authMiddleware")
// CRUD Routes

router.post("/add_purchaseinvoice",authenticate,authorize(["manager","admin"]), purchaseInvoice.createPurchaseInvoice);
router.get("/get_purchaseinvoice",authenticate,authorize(["manager","admin"]), purchaseInvoice.getAllPurchaseInvoices);
router.put("/update_purchaseinvoice/:id",authenticate,authorize(["manager","admin"]), purchaseInvoice.editPurchaseInvoice);
// router.delete("/delete_product/:id",authenticate,authorize(["manager","admin"]), productController.deleteProduct);

module.exports = router;
