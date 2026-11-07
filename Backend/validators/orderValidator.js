
export const BodyOfOrderValidator = (reqBody) =>{

    const { shippingAddress } = reqBody;

    // Checks shipping address is an object and not empty
if (!shippingAddress || typeof shippingAddress !== "object" || Array.isArray(shippingAddress)) {
  return  "Shipping address is required";
}

// checks all thsi fields are present and thier length > 0
const { street, city, state, pincode, country } = shippingAddress;

if (![street, city, state, pincode, country].every(
  (field) => typeof field === "string" && field.trim().length > 0)) {

  return  "All shipping address fields are required";


}  

return null;
}