

export const validateProduct = (reqBody) => {
  // Step 1: Check that the request body is a valid object
  if (!reqBody || typeof reqBody !== "object" || Array.isArray(reqBody)) {
    return "Invalid product data";
  }

  // Step 2: Reject fields that are not allowed
  const allowedFields = [
    "name",
    "description",
    "price",
    "stock",
    "category",
    "image",
  ];

  const requestedFields = Object.keys(reqBody);

  if (!requestedFields.every((field) => allowedFields.includes(field))) {
    return "Invalid product fields provided";
  }

  // Step 3: Extract the approved fields
  const { name, description, price, stock, category, image } = reqBody;

  // Step 4: Validate each field
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

  if (
    !category ||
    typeof category !== "string" ||
    category.trim().length === 0
  ) {
    return "Product category is required";
  }

  if (!image || typeof image !== "object" || Array.isArray(image)) {
    return "Product image is required";
  }

  if (
    typeof image.url !== "string" ||
    image.url.trim().length === 0 ||
    typeof image.publicId !== "string" ||
    image.publicId.trim().length === 0
  ) {
    return "Image must contain a valid url and publicId";
  }

  return null;
};




export const validateProductUpdate = (body) => {

    console.log("Inside validate Product Update")
  // 1. Validate the request body
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "Invalid product data";
  }

  // 2. Reject empty updates
  const requestedFields = Object.keys(body);

  if (requestedFields.length === 0) {
    return "Update body cannot be empty";
  }

  // 3. Allow only approved fields
  const allowedFields = [
    "name",
    "description",
    "price",
    "stock",
    "category",
    "image",
  ];

  if (!requestedFields.every((field) => allowedFields.includes(field))) {
    return "Invalid fields provided for update";
  }

  // 4. Validate only the fields that were provided
  const { name, description, price, stock, category, image } = body;

  if (
    "name" in body &&
    (typeof name !== "string" || name.trim().length === 0)
  ) {
    return "Product name must be a non-empty string";
  }

  if (
    "description" in body &&
    typeof description !== "string"
  ) {
    return "Description must be a string";
  }

  if (
    "price" in body &&
    (typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0)
  ) {
    return "Price must be a valid non-negative number";
  }

  if ("stock" in body && (!Number.isInteger(stock) || stock < 0)) {
    return "Stock must be a non-negative integer";
  }

  if (
    "category" in body &&
    (typeof category !== "string" || category.trim().length === 0)
  ) {
    return "Category must be a non-empty string";
  }

  if ("image" in body) {
    if (!image || typeof image !== "object" || Array.isArray(image)) {
      return "Image must be a valid object";
    }

    if (
      typeof image.url !== "string" ||
      image.url.trim().length === 0 ||
      typeof image.publicId !== "string" ||
      image.publicId.trim().length === 0
    ) {
      return "Image must contain a valid url and publicId";
    }
  }

  return null;
};





/*

Guard: Rejects invalid request bodies.
Allowlist: Rejects unexpected fields like isAdminApproved.
Destructuring: Extracts the approved product fields.
Validation: Checks the values of those fields.

*/