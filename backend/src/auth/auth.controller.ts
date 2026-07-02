import { Request, Response } from "express";
import EnrollmentModel from "../enrollment/enrollment.model";
import OtpModel from "./otp.model";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../utils/mail";
import crypto from "crypto";

export const generateToken = (req: any): any => {
    const payload = {
        email: req.email,
        fullname: req.fullname,
        mobile: req.mobile,
        gender: req.gender,
        role: req.role || "student",
        profilePic: req.profilePic,
        bio: req.bio,
        adharNo: req.adharNo,
        adharPic: req.adharPic,
        parentName: req.parentName,
        parentMobileNo: req.parentMobileNo
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "7d" })
    return token;
}

export const getSession = (req: any, res: any): any => {
    try {
        return res.status(200).json(req.user);
    }
    catch (err: any) {
        console.log(err);
    }
}

export const requestOTP = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const otp = crypto.randomInt(100000, 999999).toString();

        await OtpModel.deleteMany({ email }); // Delete old OTPs for this email
        await OtpModel.create({ email, otp });

        await sendOTPEmail(email, otp);
        return res.status(200).json({ success: true, message: "OTP sent to your email" });
    } catch (err: any) {
        console.log(err);
        console.error("Error in requestOTP:", err);
        return res.status(500).json({ success: false, message: "Failed to send OTP", error: err.message });
    }
}

export const Login = async (req: Request, res: any) => {
    try {
        const { identifier, password } = req.body;

        const user = await EnrollmentModel.findOne({
            $or: [
                { email: identifier },
                { mobile: identifier }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.password !== password) return res.status(403).json({ message: "Invalid password" })

        const token = generateToken(user);

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({
            message: "Login successful"
        });

    } catch (err: any) {

        console.log(err);
        return res.status(500).json({
            message: "Login failed"
        });
    }
};
