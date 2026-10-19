import mongoose from "mongoose";
import Product from "../models/product.js";
import validateProduct from "../validators/productValidator.js";

// Create a product
const createProduct = async (req, res) => {
  try {
    const error = validateProduct(req.body);

    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    const product = await Product.create(req.body);

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    return res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Get a single product
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Update a single product partially not replace it

const updateProduct = async (req, res) => {
  try {
    // Step 1 : Never trust request body allow specific fields to update

    const allowedUpdates = [
      "name",
      "price",
      "stock",
      "category",
      "description",
    ];

    // Step 2 : From reqbody extract keys

    const requestedFields = Object.keys(req.body);

    if (requestedFields.length === 0) {
      // Reject empty update
      // because every treats empty object as {} true so
      return res.status(400).json({
        message: "Please Add fields to upadte it cannot be empty",
      });
    }

    // Check all keys one by one each key should be in allowed update
    const isAllowed = requestedFields.every((field) =>
      allowedUpdates.includes(field),
    );

    // If any in invalid key comes to update reject it
    if (!isAllowed) {
      return res.status(400).json({
        message: "Invalid fields provided for update",
      });
    }

    // Check if product with that id exist or not

    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id, // find to find on collection
      req.body, // fields to update
      {
        new: true, // returns update document
        runValidators: true, // runs validators for new fields
      },
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product with that id does not exist || Product Not Found",
      });
    }

    //Returned the updated Product as response

    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    /*
  * Check if mongo db id user is sending it is correct format or no
    25 hexadecimal format
  * then check if product exist or no with that id in the db
  * If product exist move forward and delete if not return that product not exist in the db
  * delete product and return response 
   */
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid Product id ",
      });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
      product,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
export { createProduct, getAllProducts, getProduct, updateProduct , deleteProduct };
