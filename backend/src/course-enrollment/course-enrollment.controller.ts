import CourseEnrollmentModel from "./course-enrollment.model";
import CourseModel from "../admin/course.model";
import EnrollmentModel from "../enrollment/enrollment.model";
import { Request, Response } from "express";
import { sendPaymentSuccessEmail } from "../utils/mail";

export const createEnrollment = async (req: Request, res: Response) => {
    try {
        const enrollment = await CourseEnrollmentModel.create(req.body);
        res.status(201).json({ success: true, data: enrollment });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Enroll in a FREE course (price = 0)
export const enrollFree = async (req: any, res: Response) => {
    try {
        const { courseId } = req.body;
        const studentEmail = req.user?.email;

        if (!studentEmail) {
            return res.status(401).json({ success: false, message: "Not authenticated" });
        }

        const course: any = await CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        const finalPrice = Math.max(0, (course.price || 0) - (course.discount || 0));
        if (finalPrice > 0) {
            return res.status(400).json({ success: false, message: "This course is not free" });
        }

        // Check for duplicate enrollment
        const existing = await CourseEnrollmentModel.findOne({ studentEmail, courseId });
        if (existing) {
            return res.status(409).json({ success: false, message: "Already enrolled in this course" });
        }

        const enrollment = new CourseEnrollmentModel({
            studentEmail,
            courseId,
            paymentId: "FREE",
            status: "enrolled",
            isFree: true,
            enrolledAt: new Date(),
        });
        await enrollment.save();

        // Send enrollment confirmation email
        try {
            const student = await EnrollmentModel.findOne({ email: studentEmail });
            const fullname = student?.fullname || studentEmail;

            await sendPaymentSuccessEmail(studentEmail, {
                fullname,
                courseName: course.title,
                amount: 0,
                paymentId: "FREE",
                orderId: "N/A",
                enrolledAt: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
            });
        } catch (mailErr) {
            console.error("Failed to send free enrollment email:", mailErr);
        }

        return res.status(201).json({ success: true, data: enrollment });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Get current student's enrollments (with course details populated)
// Also auto-expires any enrollment whose endingDate has passed
export const getMyCourses = async (req: any, res: Response) => {
    try {
        const studentEmail = req.user?.email;

        if (!studentEmail) {
            return res.status(401).json({ success: false, message: "Not authenticated" });
        }

        const now = new Date();

        // Bulk-expire all active enrollments that have passed their endingDate
        await CourseEnrollmentModel.updateMany(
            {
                studentEmail,
                endingDate: { $lt: now },
                status: { $in: ["enrolled", "ongoing"] }
            },
            { $set: { status: "expired" } }
        );

        const enrollments = await CourseEnrollmentModel.find({ studentEmail })
            .populate("courseId")
            .sort({ enrolledAt: -1 });

        return res.status(200).json({ success: true, enrollments });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const getEnrollmentByPaymentId = async (req: Request, res: Response) => {
    try {
        const enrollment = await CourseEnrollmentModel.findOne({ paymentId: req.params.paymentId }).populate("courseId");
        res.status(200).json({ success: true, data: enrollment });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const getEnrollmentByStudentEmail = async (req: Request, res: Response) => {
    try {
        const enrollment = await CourseEnrollmentModel.find({ studentEmail: req.params.studentEmail }).populate("courseId");
        res.status(200).json({ success: true, data: enrollment });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const getAllEnrollments = async (req: Request, res: Response) => {
    try {
        const enrollments = await CourseEnrollmentModel.find().populate("courseId");
        res.status(200).json({ success: true, data: enrollments });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const updateEnrollmentStatus = async (req: Request, res: Response) => {
    try {
        const enrollment = await CourseEnrollmentModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: enrollment });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
}