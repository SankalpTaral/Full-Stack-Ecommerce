import User from "../models/user.js";
import {
  validateUser,
  validateUserLogin,
} from "../validators/userValidator.js";
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
      message: "Internal Server Error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const validateUserRequest = validateUserLogin(req.body);

    if (validateUserRequest) {
      return res.status(400).json({
        message: validateUserRequest,
      });
    }

    // i come here if all  my login body from user is validated

    // Step 2 : Check if user with those credentials exist or no in the db

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // if user does not exist then return
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Step 3 : Here i come if user exist with that email Check password

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

      // Step 4 : return a response that login succesfull

      return res.status(200).json({
        message : "Logged in Successfull"
      })

    } catch (err) {
    return res.status(500).json({
      message: "Internal server error"
    })
  }
}

/*
Validate request

Find user by email

Compare password with bcrypt

Return login success
*/