import { Request } from "express";
import EnrollmentModel from "./enrollment.model";
import OtpModel from "../auth/otp.model";

export const enrollment = async (req: Request, res: any) => {
    try {
        const { otp, email } = req.body;

        if (!otp || !email) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const otpRecord = await OtpModel.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        let adharPicUrl = req.body.adharPic;
        if (req.file) {
            adharPicUrl = `/uploads/${req.file.filename}`;
        }

        const enrollmentData = { ...req.body, adharPic: adharPicUrl };
        const newEnrollment = new EnrollmentModel(enrollmentData);
        await newEnrollment.save();

        await OtpModel.deleteMany({ email }); // Delete OTP after successful registration

        return res.status(200).json({ message: "YOU ARE NOW PART OF GSM LEARNING....." })

    }
    catch (err: any) {
        console.log(err);
        return res.status(500).json({ message: "Failed to enrolled!" })
    }
}
