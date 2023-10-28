import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(()=> {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

const app = express();

app.use(express.json());
// to access cookies
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

// middleware for handling error
app.use(( err, req, res, next ) => {
    // if statusCode is there then get that else assign 500
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return res.status(statusCode).json({
        success: false,
        statusCode : statusCode,
        message: message
    });
});


app.listen(3001, ()=> {
    console.log("Server is running on port 3001");
});