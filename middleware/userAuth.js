
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const userAuth = async (req, res, next) => {

  console.log("User Auth");
  // Step 1: Check whether the browser sent the authentication cookie
  const { token } = req.cookies ?? {};

  if (!token) {
    return res.status(401).json({
      message: "Please login first",
    });
  }

  // Step 2: Verify the JWT separately
  // If the token is invalid, malformed, or expired, return 401
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }

  // Step 3: Extract the user ID from the verified JWT payload
  // Your login controller creates the token using { id: user._id }
  const { id } = decoded;

  // Step 4: Find the user in MongoDB
  // Database errors should not be treated as invalid-token errors
  try {
    const user = await User.findById(id).select("-password");

    // Step 5: If the user no longer exists, reject the request
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // Step 6: Attach the authenticated user to the request
    // Later middleware and controllers can access req.user
    req.user = user;

    // Step 7: Continue to the next middleware or route handler
    return next();
  } catch (err) {
    // Unexpected database or server error
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
