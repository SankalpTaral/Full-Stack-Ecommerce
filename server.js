
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import adminRouter from "./routes/adminRouter.js";
import authRouter from './routes/authRouter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7777;


app.use(express.json())




app.use("/admin", adminRouter);
app.use("/",authRouter)

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
};

startServer();
