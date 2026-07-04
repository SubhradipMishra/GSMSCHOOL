
import { Router } from "express";
import {
    createEnrollment,
    getAllEnrollments,
    getEnrollmentByPaymentId,
    getEnrollmentByStudentEmail,
    updateEnrollmentStatus,
    getMyCourses,
    enrollFree
} from "./course-enrollment.controller";
import { studentGaurd } from "../middleware/auth.middleware";

const CourseEnrollmentRouter = Router();

// Protected routes (student must be logged in)
CourseEnrollmentRouter.get("/my-courses", studentGaurd, getMyCourses);
CourseEnrollmentRouter.post("/enroll-free", studentGaurd, enrollFree);

// General routes
CourseEnrollmentRouter.post("/", createEnrollment);
CourseEnrollmentRouter.get("/", getAllEnrollments);
CourseEnrollmentRouter.put("/:id", updateEnrollmentStatus);
CourseEnrollmentRouter.get("/paymentId/:paymentId", getEnrollmentByPaymentId);
CourseEnrollmentRouter.get("/studentEmail/:studentEmail", getEnrollmentByStudentEmail);

export default CourseEnrollmentRouter;