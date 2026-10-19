

const validateProduct = (reqBody) => {
    const { name, description, price, stock, category } = reqBody;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
        return "Product name is required";
    }

    if (!description || typeof description !== "string") {
        return "Product description is required";
    }

    if (typeof price !== "number" || price < 0 || !Number.isFinite(price)) {
        return "Price must be a valid non-negative number";
    }

    if (!Number.isInteger(stock) || stock < 0) {
        return "Stock must be a non-negative integer";
    }

    if (!category || typeof category !== "string" || category.trim().length === 0) {
        return "Product category is required";
    }

    return null; 
};

export default validateProduct;


