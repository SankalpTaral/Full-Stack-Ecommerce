import User from "../models/user.js";
import validateUser from "../validators/userValidator.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  // Step 1 : Validate the request Body
  try {
    const validateUserRequest = validateUser(req.body);

    if (validateUserRequest) {
      return res.status(400).json({
        message: validateUserRequest,
      });
    }
    // if i reach here meaning i passed check

    const { name, email, password } = req.body;

    // Step 2 : Check if user already exists or not in db

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    //Step 3: Hash the password

    const hashedPassword = await bcrypt.hash(password, 10);

    // Step4 : Create the User and saves  into the database

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Signed up successfully",
    });

  } catch (err) {
    res.status(500).json({
        message : "Internal Server Error"
    })
  }
};

