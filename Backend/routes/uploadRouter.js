// import express from "express";
// import upload from "../config/multer.js";

// const router = express.Router();

// router.post("/upload", upload.single("image"), (req, res) => {
//   console.log(req.file);

//   res.json({
//     message: "Image received successfully",
//   });
// });

// export default router;



import express from "express";
import upload from "../config/multer.js";
import uploadToCloudinary from "../utils/cloudinaryUpload.js";

const router = express.Router();

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const result = await uploadToCloudinary(req.file.buffer);

    res.json({
      message: "Image uploaded successfully",
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;