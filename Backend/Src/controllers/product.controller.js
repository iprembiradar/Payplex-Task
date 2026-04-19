const Product = require("../models/ProductModels");

// ////////////////////////Add Product////////////////////////////////////////////////
const addProduct = async (req, res) => {
  try {
    const { title, price, category, image, description, stock } = req.body;

    if (!title || !price || !category || !image || !description || !stock) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const product = new Product({
      title,
      price: Number(price),
      category,
      image,
      description,
      stock: Number(stock)
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product
    });
  } catch (error) {
    console.log("ADD PRODUCT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add product"
    });
  }
};

////////////////////////////////// Get All Products/////////////////////////////////////////////////////
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    console.log("GET PRODUCTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products"
    });
  }
};

// ///////////////////////////////////////////////////////////////////


/////////////////////// Delete Product/////////////////////////////////////////////////////////////////////////////
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.log("DELETE PRODUCT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product"
    });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  deleteProduct
};


