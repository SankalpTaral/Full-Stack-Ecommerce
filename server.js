
import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from "url";
import connectDB from './config/database.js';
import adminRouter from "./routes/adminRouter.js";
import authRouter from './routes/authRouter.js';
import cookieParser from "cookie-parser";
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';
import uploadRouter from "./routes/uploadRouter.js";
import paymentRouter from './routes/paymentRouter.js';
import path from "path";
dotenv.config();


const app = express();
const PORT = process.env.PORT || 7777;


app.use(express.json())
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));




app.use("/admin", adminRouter);
app.use("/",authRouter)
app.use("/",userRouter)
app.use("/products",productRouter)
app.use("/api/payment",paymentRouter)
app.use("/api",uploadRouter)

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
};

startServer();
