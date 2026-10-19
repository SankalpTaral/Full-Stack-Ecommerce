
import Product from "../models/product.js";
import validateProduct from "../validators/productValidator.js";


const createProduct = async (req, res) => {
    try {
        // 1. Validate incoming data
        const error = validateProduct(req.body);

        // 2. Reject invalid data
        if (error) {
            return res.status(400).json({
                message: error
            });
        }

        // 3. Save product to MongoDB
        const product = await Product.create(req.body);

        // 4. Return the created product
        return res.status(201).json({
            message: "Product created successfully",
            product
        });

    } catch (error) {
        console.error("Create product error:", error.message);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export default createProduct;
