import { NextFunction } from "express";
import jwt from "jsonwebtoken";


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