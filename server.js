
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import adminRouter from "./routes/adminRouter.js";
import authRouter from './routes/authRouter.js';
import cookieParser from "cookie-parser";
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 7777;


app.use(express.json())
app.use(cookieParser());




app.use("/admin", adminRouter);
app.use("/",authRouter)
app.use("/",userRouter)
app.use("/products",productRouter)

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
};

startServer();
