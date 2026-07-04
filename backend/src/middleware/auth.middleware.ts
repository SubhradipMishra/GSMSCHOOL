import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";


export const studentGaurd = async (req: any, res: any, next: NextFunction) => {
    try {
        const { authToken } = req.cookies;
        if (!authToken) return res.status(401).json({ message: "PLEASE LOGIN FIRST!" })
        const user: any = await jwt.verify(authToken, process.env.JWT_SECRET as string)
        if (user?.role != "student") return res.status(403).json({ messsage: "ACCESS DENIED!" })
        req.user = user;
        next()
    }

    catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}


export const teacherGaurd = async (req: any, res: any, next: NextFunction) => {
    try {
        const { authToken } = req.cookies;
        if (!authToken) return res.status(401).json({ message: "PLEASE LOGIN FIRST!" })
        const user: any = await jwt.verify(authToken, process.env.JWT_SECRET as string)
        if (user?.role != "teacher") return res.status(403).json({ messsage: "ACCESS DENIED!" })
        req.user = user;
        next()
    }

    catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}


export const adminGaurd = async (req: any, res: any, next: NextFunction) => {
    try {
        const { authToken } = req.cookies;
        if (!authToken) return res.status(401).json({ message: "PLEASE LOGIN FIRST!" })
        const user: any = await jwt.verify(authToken, process.env.JWT_SECRET as string)
        if (user?.role != "admin") return res.status(403).json({ messsage: "ACCESS DENIED!" })
        req.user = user;
        next()
    }

    catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}


export const adminStudentTeacherGaurd = async (req: any, res: any, next: NextFunction) => {
    try {
        const { authToken } = req.cookies;
        if (!authToken) return res.status(401).json({ message: "PLEASE LOGIN FIRST!" })
        const user: any = await jwt.verify(authToken, process.env.JWT_SECRET as string)
        const role = user?.role || "student";
        if (role != "admin" && role != "student" && role != "teacher") return res.status(403).json({ messsage: "ACCESS DENIED!" })
        req.user = { ...user, role };
        next()
    }

    catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}



export const adminTeacherGaurd = async (req: any, res: any, next: NextFunction) => {
    try {
        const { authToken } = req.cookies;
        if (!authToken) return res.status(401).json({ message: "PLEASE LOGIN FIRST!" })
        const user: any = await jwt.verify(authToken, process.env.JWT_SECRET as string)
        if (user?.role != "admin" && user.role != "teacher") return res.status(403).json({ messsage: "ACCESS DENIED!" })
        req.user = user;
    }

    catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const RazorpayGaurd = async (req: any, res: any, next: NextFunction) => {
    try {
        console.log("WEBHOOK HIT")
        const signature = req.headers["x-razorpay-signature"];

        console.log("[Razorpay Webhook] Webhook request received. Checking signature...");

        const payload = typeof req.body === "string"
            ? req.body
            : Buffer.isBuffer(req.body)
                ? req.body.toString()
                : JSON.stringify(req.body);

        const secret = process.env.RZP_WEBHOOK_SECRET as string || "1136fbc17f53dd0042401ecd3417be9422f35fc9f3a6823a053403a9f76088a2";
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(payload)
            .digest("hex");

        console.log("[Razorpay Webhook] Received Signature:", signature);
        console.log("[Razorpay Webhook] Expected Signature:", expectedSignature);

        if (signature !== expectedSignature) {
            console.error("[Razorpay Webhook] Webhook signature verification mismatch! Please check RZP_WEBHOOK_SECRET in .env.");
            return res.status(401).json({ message: "BAD REQUEST!" });
        }

        next();
    }
    catch (err: any) {
        console.error("[Razorpay Webhook] Error in RazorpayGuard signature verification:", err);
        return res.status(401).json({ message: "Invalid Token" });
    }
};