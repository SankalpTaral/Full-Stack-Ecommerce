import validator from "validator";

const validateUser = (reqBody) => {
  // Step 1: Check the user fields can send only the required fields
  const allowedFields = ["name", "email", "password"];

  // Check if reqBody is a valid object

  if (!reqBody || typeof reqBody !== "object" || Array.isArray(reqBody)) {
    return "Invalid request body";
  }

  const requestedFields = Object.keys(reqBody);

  const isAllowed = requestedFields.every((field) =>
    allowedFields.includes(field),
  );

  if (!isAllowed) {
    return "Invalid fields provided";
  }

  const { name, email, password } = reqBody;

  if (typeof name !== "string" || !name.trim()) {
    return "Name is required";
  }

  if (typeof email !== "string" || !email.trim()) {
    return "Email is required";
  }

  if (typeof password !== "string" || !password) {
    return "Password is required";
  }

  //Step 2 : Check name should not be empty

  if (name.trim().length < 3) {
    return "Name must be at least 3 characters";
  }

  // Validate email through validate npm package

  if (!validator.isEmail(email)) {
    // if it passes it returns true so if not passes it returns false
    return "Invalid email";
  }

  // Validate strong password weak password gets rejected

  if (!validator.isStrongPassword(password)) {
    return "Password is too weak";
  }

  return null; // means all the checks are passed
};

export default validateUser;

/*
1. Allow only the fields required for customer signup:
   name, email, password.
   This prevents users from sending unexpected fields like role: "admin".

2. Check that reqBody exists, is an object, and is not an array.
   This prevents errors when accessing or destructuring the request body.

3. Extract all keys from reqBody using Object.keys().

4. Use every() and includes() to ensure every submitted field
   exists in the allowedFields array.

5. Reject the request if any unexpected field is provided.

6. Destructure name, email, and password from reqBody.

7. Check that name is a non-empty string.

8. Check that email is a non-empty string.

9. Check that password is a non-empty string.

10. Ensure the trimmed name contains at least 3 characters.

11. Use validator.isEmail() to check whether the email
    follows a valid email format.

12. Use validator.isStrongPassword() to enforce password
    strength requirements.

13. Return an error message immediately when a check fails.

14. Return null when all validation checks pass.

*/