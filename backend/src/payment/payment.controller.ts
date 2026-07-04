import Razorpay from "razorpay";
import { Request, Response } from "express";

import CourseModel from "../admin/course.model";
import { createOrder } from "../order/order.controller";
import OrderModel from "../order/order.model";
import PaymentModel from "./payment.model";
import CourseEnrollmentModel from "../course-enrollment/course-enrollment.model";
import EnrollmentModel from "../enrollment/enrollment.model";
import { sendPaymentSuccessEmail, sendPaymentFailureEmail, sendEventBookingSuccessEmail, sendEventBookingFailureEmail } from "../utils/mail";
import EventModel from "../event/event.model";
import EventBookingModel from "../event/event-booking.model";

const getInstance = () => {
    return new Razorpay({
        key_id: process.env.KEY_ID || "rzp_test_T8wo3gphNXfk22",
        key_secret: process.env.KEY_SECRET || "IzXcFaY0WNaMCh3S7OGxiEbZ",
    });
};

export const generateOrdersCourse = async (req: any, res: Response) => {
    try {
        console.log("========== GENERATE ORDER ==========");
        console.log("User:", req.user);

        const { courseId } = req.body;
        const studentEmail = req.user?.email;

        if (!studentEmail) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        const course: any = await CourseModel.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        const price = (course.price || 0) - (course.discount || 0);

        const razorpay = getInstance();

        const razorpayOrder: any = await razorpay.orders.create({
            amount: price * 100,
            currency: "INR",
            receipt: `GSM_${Date.now()}`,
        });

        console.log("Razorpay Order:", razorpayOrder);

        const payload = {
            studentEmail,
            courseId,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount / 100,
            status: "pending",
        };

        console.log("Saving Order:", payload);

        await createOrder(payload);

        return res.status(200).json({
            success: true,
            order: razorpayOrder,
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate order",
        });
    }
};

const paymentSuccess = async (payload: any) => {
    try {
        const payment = payload.payload.payment.entity;
        const order = payload.payload.order.entity;

        console.log("========== PAYMENT SUCCESS ==========");
        console.log("Payment ID :", payment.id);
        console.log("Order ID   :", order.id);
        console.log("Amount     :", payment.amount / 100);
        console.log("Status     :", payment.status);
        console.log("PAYMENT-", payment);

        const dbOrder = await OrderModel.findOne({
            razorpayOrderId: order.id
        });

        if (!dbOrder) {
            console.log("Order Not Found. Checking EventBooking...");
            const dbBooking = await EventBookingModel.findOne({
                razorpayOrderId: order.id
            });

            if (!dbBooking) {
                console.log("No matching Course Order or Event Booking found.");
                return;
            }

            if (dbBooking.status === "booked") {
                console.log("Booking already processed, skipping.");
                return;
            }

            dbBooking.status = "booked";
            dbBooking.paymentId = payment.id;
            await dbBooking.save();

            const event = await EventModel.findById(dbBooking.eventId);
            if (event) {
                event.seatsBooked = (event.seatsBooked || 0) + 1;
                await event.save();

                // Send email
                try {
                    const student = await EnrollmentModel.findOne({ email: dbBooking.studentEmail });
                    const fullname = student?.fullname || dbBooking.studentEmail;

                    await sendEventBookingSuccessEmail(dbBooking.studentEmail, {
                        fullname,
                        eventTitle: event.title,
                        amount: dbBooking.amount,
                        paymentId: payment.id,
                        date: event.date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
                        time: event.time,
                        place: event.place
                    });

                    console.log("Event booking confirmation email sent to:", dbBooking.studentEmail);
                } catch (mailErr) {
                    console.error("Failed to send event booking success email:", mailErr);
                }
            }
            return;
        }

        // Idempotency check – skip if already processed
        if (dbOrder.status === "success") {
            console.log("Order already processed, skipping.");
            return;
        }

        dbOrder.status = "success";
        await dbOrder.save();

        const newPayment = new PaymentModel({
            studentEmail: dbOrder.studentEmail,
            razorpayOrderId: order.id,
            razorpayPaymentId: payment.id,
            amount: payment.amount / 100,
            status: payment.status,
            method: payment.method,
            currency: payment.currency
        });
        await newPayment.save();

        // enrollment
        const course: any = await CourseModel.findById(dbOrder.courseId);
        if (!course) {
            console.log("Course Not Found");
            return;
        }

        const startDate = new Date();
        const endDate: any = new Date(startDate);
        endDate.setDate(endDate.getDate() + 30);

        const enrollment = new CourseEnrollmentModel({
            studentEmail: dbOrder.studentEmail,
            courseId: dbOrder.courseId,
            paymentId: newPayment.razorpayPaymentId,
            status: "enrolled",
            endingDate: endDate,
            duration: course.duration,
            isFree: false,
            enrolledAt: startDate
        });
        await enrollment.save();

        // Send confirmation email
        try {
            const student = await EnrollmentModel.findOne({ email: dbOrder.studentEmail });
            const fullname = student?.fullname || dbOrder.studentEmail;

            await sendPaymentSuccessEmail(dbOrder.studentEmail, {
                fullname,
                courseName: course.title,
                amount: payment.amount / 100,
                paymentId: payment.id,
                orderId: order.id,
                enrolledAt: startDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
                endingDate: endDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
            });

            console.log("Payment success email sent to:", dbOrder.studentEmail);
        } catch (mailErr) {
            console.error("Failed to send payment success email:", mailErr);
        }

    } catch (error) {
        console.log(error);
    }
};

const paymentFailed = async (payload: any) => {
    try {
        const payment = payload.payload.payment.entity;

        console.log("========== PAYMENT FAILED ==========");
        console.log("Payment ID :", payment.id);
        console.log("Order ID   :", payment.order_id);

        const dbOrder = await OrderModel.findOne({
            razorpayOrderId: payment.order_id
        });

        if (!dbOrder) {
            console.log("Order Not Found for failed payment. Checking EventBooking...");
            const dbBooking = await EventBookingModel.findOne({
                razorpayOrderId: payment.order_id
            });

            if (!dbBooking) {
                console.log("No matching Course Order or Event Booking found for failure.");
                return;
            }

            if (dbBooking.status !== "pending") {
                console.log("Booking already processed, skipping failure.");
                return;
            }

            dbBooking.status = "failed";
            await dbBooking.save();

            const event = await EventModel.findById(dbBooking.eventId);
            if (event) {
                try {
                    const student = await EnrollmentModel.findOne({ email: dbBooking.studentEmail });
                    const fullname = student?.fullname || dbBooking.studentEmail;
                    const reason = payment.error_description || payment.error_reason || undefined;

                    await sendEventBookingFailureEmail(dbBooking.studentEmail, {
                        fullname,
                        eventTitle: event.title,
                        amount: dbBooking.amount,
                        orderId: payment.order_id,
                        reason
                    });
                    console.log("Event booking failure email sent to:", dbBooking.studentEmail);
                } catch (mailErr) {
                    console.error("Failed to send event booking failure email:", mailErr);
                }
            }
            return;
        }

        if (dbOrder.status !== "pending") {
            console.log("Order already processed, skipping failure.");
            return;
        }

        dbOrder.status = "failed";
        await dbOrder.save();

        // Send failure email
        try {
            const course: any = await CourseModel.findById(dbOrder.courseId);
            const student = await EnrollmentModel.findOne({ email: dbOrder.studentEmail });
            const fullname = student?.fullname || dbOrder.studentEmail;
            const courseName = course?.title || "your course";
            const reason = payment.error_description || payment.error_reason || undefined;

            await sendPaymentFailureEmail(dbOrder.studentEmail, {
                fullname,
                courseName,
                amount: dbOrder.amount,
                orderId: payment.order_id,
                reason,
            });

            console.log("Payment failure email sent to:", dbOrder.studentEmail);
        } catch (mailErr) {
            console.error("Failed to send payment failure email:", mailErr);
        }

    } catch (error) {
        console.log(error);
    }
};

export const webhook = async (req: Request, res: Response) => {
    try {
        console.log("========== WEBHOOK ==========");

        const payload = JSON.parse((req.body as Buffer).toString());

        console.log("Event:", payload.event);

        switch (payload.event) {
            case "order.paid":
                await paymentSuccess(payload);
                break;

            case "payment.captured":
                console.log("Payment Captured");
                break;

            case "payment.failed":
                await paymentFailed(payload);
                break;

            default:
                console.log("Unhandled Event:", payload.event);
        }

        return res.status(200).json({
            success: true,
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Webhook Error",
        });
    }
};