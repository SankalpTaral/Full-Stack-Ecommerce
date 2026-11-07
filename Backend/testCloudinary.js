import "dotenv/config";
import cloudinary from "./config/cloudinary.js";

const result = await cloudinary.api.ping();

console.log(result);