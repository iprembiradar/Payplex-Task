const express = require("express");
const router = express.Router();

const {
  addProduct,
  getAllProducts,
  deleteProduct
} = require("../controllers/product.controller");

router.post("/add", addProduct);

router.get("/", getAllProducts);


router.delete("/:id", deleteProduct);

module.exports = router;