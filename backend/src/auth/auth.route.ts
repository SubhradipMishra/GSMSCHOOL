import { Router } from "express";
import { getSession, Login, requestOTP } from "./auth.controller";
import { adminStudentTeacherGaurd } from "../middleware/auth.middleware";

const authRouter = Router()

authRouter.post("/login", Login);
authRouter.post("/send-otp", requestOTP);
authRouter.get("/session", adminStudentTeacherGaurd, getSession);

export default authRouter;