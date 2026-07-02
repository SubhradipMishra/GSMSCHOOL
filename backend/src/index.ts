import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
dotenv.config();

import mongoose from "mongoose";
mongoose.connect(process.env.DB_URL as string)
    .then(() => console.log("DATABASE Connected successfully..."))
    .catch(() => console.log("DATABASE FAILED TO CONNECT!"))

import AuthRouter from "./auth/auth.route";
import EnrollmentRouter from "./enrollment/enrollment.route";
import AdminRouter from "./admin/admin.route";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

app.use("/auth", AuthRouter);
app.use("/enrollment", EnrollmentRouter);
app.use("/admin", AdminRouter);

app.listen(process.env.PORT as string, () => console.log(`Server running on port ${process.env.PORT}`))