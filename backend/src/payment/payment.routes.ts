
import express from "express";
import { generateOrdersCourse, webhook } from "./payment.controller";
import { RazorpayGaurd, studentGaurd } from "../middleware/auth.middleware";


const PaymentRouter = express.Router();

PaymentRouter.post("/course/order", studentGaurd, generateOrdersCourse);
PaymentRouter.post("/webhook", RazorpayGaurd, webhook);

export default PaymentRouter;  