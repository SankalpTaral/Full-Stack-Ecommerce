import mongoose from "mongoose";
import Product from "../models/product.js";
import {
  validateProductUpdate,
  validateProduct,
} from "../validators/productValidator.js";

// Create a product
const createProduct = async (req, res) => {
  const { name, price, stock, category, description, image } = req.body;
  try {
    const error = validateProduct(req.body);

    if (error) {
      return res.status(400).json({
        message: error,
      });
    }
    const productData = {
      name,
      price,
      stock,
      category,
      description,
      ...(image !== undefined && { image }),
    };

    const product = await Product.create(productData);

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
    // ==========================================
    // 1. NORMALIZE QUERY PARAMETER NAMES & VALUES
    // ==========================================


    console.log("req.query:", req.query);

    const normalizedQuery = {};

    for (const [key, value] of Object.entries(req.query)) {
      // Convert parameter names to lowercase.
      // Example: Category -> category
      const normalizedKey = key.toLowerCase();

        console.log("key:", key);
  console.log("value:", value);
  console.log("type:", typeof value);

      // Prevent duplicate parameters after normalization.
      // Example: ?category=Books&Category=Electronics
      
      if (Object.hasOwn(normalizedQuery, normalizedKey)) {
  return res.status(400).json({
    success: false,
    message: "Duplicate query parameters",
  });
}
      // Trim string values and lowercase category/sort values.
  
      console.log(typeof(value));
      if (typeof value === "string") {
  const trimmedValue = value.trim();

  if (normalizedKey === "category" || normalizedKey === "sort") {
    normalizedQuery[normalizedKey] = trimmedValue.toLowerCase();
  } else {
    normalizedQuery[normalizedKey] = trimmedValue;
  }
} 
else {
  normalizedQuery[normalizedKey] = value;
}
    }
 

   
    // ==========================================
    // 2. ALLOW ONLY APPROVED QUERY PARAMETERS
    // ==========================================

    const allowedQueryParams = [
      "page",
      "limit",
      "category",
      "search",
      "sort",
    ];

    const hasInvalidParams = Object.keys(normalizedQuery).some(
      (param) => !allowedQueryParams.includes(param)
    );

    if (hasInvalidParams) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
      });
    }

    // ==========================================
    // 3. EXTRACT & VALIDATE PAGINATION
    // ==========================================

    // Defaults: page 1, 10 products per page.
    const page =
      normalizedQuery.page === undefined
        ? 1
        : Number(normalizedQuery.page);

    const requestedLimit =
      normalizedQuery.limit === undefined
        ? 10
        : Number(normalizedQuery.limit);

    // Page and limit must be positive integers.
    // Reject values such as -1, 1.5, "abc", or 0.
    if (
      (normalizedQuery.page !== undefined &&
        (typeof normalizedQuery.page !== "string" ||
          !/^\d+$/.test(normalizedQuery.page))) ||
      (normalizedQuery.limit !== undefined &&
        (typeof normalizedQuery.limit !== "string" ||
          !/^\d+$/.test(normalizedQuery.limit))) ||
      !Number.isSafeInteger(page) ||
      page < 1 ||
      !Number.isSafeInteger(requestedLimit) ||
      requestedLimit < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Page and limit must be positive integers",
      });
    }

    // Prevent clients from requesting excessively large pages.
    const limit = Math.min(requestedLimit, 50);

    if (!Number.isSafeInteger((page - 1) * limit)) {
      return res.status(400).json({
        success: false,
        message: "Page is too large",
      });
    }

    // ==========================================
    // 4. EXTRACT & VALIDATE FILTER PARAMETERS
    // ==========================================

    const { category, search, sort } = normalizedQuery;

    // Reject non-string category values.
    if (
      category !== undefined &&
      typeof category !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Category must be a string",
      });
    }

    // Reject non-string search values.
    if (
      search !== undefined &&
      typeof search !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Search must be a string",
      });
    }

    // Reject empty values after trimming.
    if (category !== undefined && category.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Category cannot be empty",
      });
    }

    if (search !== undefined && search.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Search cannot be empty",
      });
    }

    // ==========================================
    // 5. ESCAPE REGEX SPECIAL CHARACTERS
    // ==========================================

    // Treat characters such as .* and + literally,
    // rather than allowing them to change the search pattern.
    const escapeRegex = (value) =>
      value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // ==========================================
    // 6. BUILD THE MONGODB FILTER
    // ==========================================

    const filter = {};

    // Search product names without case sensitivity.
    if (search !== undefined) {
      filter.name = {
        $regex: escapeRegex(search), // C++ if u type in regex + has  diff meaning so to avoid that we use escape search
        // it treates + as normal character doesnt trigger regex pattern + 
        $options: "i", // ignore letter casing for matching name in the db
      };
    }

    // Match the entire category, ignoring capitalization.
    // Example: electronics matches Electronics and ELECTRONICS.
    if (category !== undefined) {
      filter.category = {
        $regex: `^${escapeRegex(category)}$`,
        $options: "i",
      };
    }

    // ==========================================
    // 7. VALIDATE & BUILD SORT OPTIONS
    // ==========================================

    let sortOption = {};

    if (sort !== undefined && sort !== "") {
      if (sort === "low_to_high") {
        // Lowest price first.
        sortOption = { price: 1 };
      } else if (sort === "high_to_low") {
        // Highest price first.
        sortOption = { price: -1 };
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid sort value",
          allowedValues: ["low_to_high", "high_to_low"],
        });
      }
    }

    // ==========================================
    // 8. COUNT MATCHING PRODUCTS
    // ==========================================

    // Count only products matching the selected filters.
    const totalProducts = await Product.countDocuments(filter);

    const totalPages = Math.ceil(totalProducts / limit);

    // If products exist but the requested page exceeds
    // the available pages, return 404.
    // If there are zero products, return an empty list instead.
    if (totalProducts > 0 && page > totalPages) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    // ==========================================
    // 9. FETCH PRODUCTS
    // ==========================================

    // Example: page 1 with limit 10 -> skip 0.
    //          page 2 with limit 10 -> skip 10.
    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // ==========================================
    // 10. SEND SUCCESS RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      page,
      limit,
      totalProducts,
      totalPages,
      products,
    });
  } catch (error) {
    // Log the detailed error for development/debugging.
    // Do not expose internal database errors to API clients.
    console.error("Get all products error:", error);

    return res.status(500).json({
      success: false,
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

    console.log("Inside update product");

    const validateProductBody = validateProductUpdate(req.body);

    if (validateProductBody) {
      return res.status(400).json({
        message: validateProductBody,
      });
    }

    // Check if product with that id exist or not

    const { id } = req.params;

    console.log(id);

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    // image related check

    if (req.body.image !== undefined) {
      const { url, publicId } = req.body.image;

      if (
        !url ||
        typeof url !== "string" ||
        !publicId ||
        typeof publicId !== "string"
      ) {
        return res.status(400).json({
          message: "Image must contain a valid url and publicId",
        });
      }
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

    console.log(updatedProduct);

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
export {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
