const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
const {authenticate,authorize}=require("../middleware/authMiddleware")
// CRUD Routes

router.post("/add_product",authenticate,authorize(["manager","admin"]), productController.createProduct);
router.get("/get_product",authenticate,authorize(["manager","admin"]), productController.getAllProducts);
router.put("/update_product/:id",authenticate,authorize(["manager","admin"]), productController.updateProduct);
router.delete("/delete_product/:id",authenticate,authorize(["manager","admin"]), productController.deleteProduct);
router.get("/search_product",authenticate,authorize(["manager","admin"]), productController.getAllProductsSearch);

module.exports = router;
