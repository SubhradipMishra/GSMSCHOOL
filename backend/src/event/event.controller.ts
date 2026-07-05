import { Request, Response } from "express";
import EventModel from "./event.model";
import EventBookingModel from "./event-booking.model";
import EnrollmentModel from "../enrollment/enrollment.model";
import { sendEventBookingSuccessEmail } from "../utils/mail";
import Razorpay from "razorpay";
import { awardXP } from "../xp/xp.controller";

const getRazorpayInstance = () => {
    return new Razorpay({
        key_id: process.env.KEY_ID || "rzp_test_T8wo3gphNXfk22",
        key_secret: process.env.KEY_SECRET || "IzXcFaY0WNaMCh3S7OGxiEbZ",
    });
};

// ==================== ADMIN OPERATIONS ====================

// Create Event
export const createEvent = async (req: Request, res: Response): Promise<any> => {
    try {
        const { title, place, description, subject, organiser, seat, price, date, time, dressCode, notes } = req.body;

        if (!title || !place || !description || !subject || !organiser || seat === undefined || price === undefined || !date || !time) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        let documentUrl = "";
        if (req.file) {
            documentUrl = `/uploads/${req.file.filename}`;
        }

        const newEvent = await EventModel.create({
            title,
            place,
            description,
            subject,
            organiser,
            seat: Number(seat),
            price: Number(price),
            date: new Date(date),
            time,
            dressCode,
            notes,
            documentUrl,
            status: "active"
        });

        return res.status(201).json({ success: true, message: "Event created successfully", event: newEvent });
    } catch (error: any) {
        console.error("Error creating event:", error);
        return res.status(500).json({ success: false, message: "Failed to create event", error: error.message });
    }
};

// Get Admin Events
export const getAdminEvents = async (req: Request, res: Response): Promise<any> => {
    try {
        const events = await EventModel.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, events });
    } catch (error: any) {
        console.error("Error fetching admin events:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch events", error: error.message });
    }
};

// Update Event
export const updateEvent = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const updates: any = { ...req.body };

        if (req.file) {
            updates.documentUrl = `/uploads/${req.file.filename}`;
        }

        if (updates.seat) updates.seat = Number(updates.seat);
        if (updates.price) updates.price = Number(updates.price);
        if (updates.date) updates.date = new Date(updates.date);

        const updatedEvent = await EventModel.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedEvent) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        return res.status(200).json({ success: true, message: "Event updated successfully", event: updatedEvent });
    } catch (error: any) {
        console.error("Error updating event:", error);
        return res.status(500).json({ success: false, message: "Failed to update event", error: error.message });
    }
};

// Delete Event
export const deleteEvent = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const deletedEvent = await EventModel.findByIdAndDelete(id);

        if (!deletedEvent) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        // Also delete associated bookings or mark them cancelled
        await EventBookingModel.updateMany({ eventId: id }, { status: "cancelled" });

        return res.status(200).json({ success: true, message: "Event deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting event:", error);
        return res.status(500).json({ success: false, message: "Failed to delete event", error: error.message });
    }
};

// ==================== PUBLIC / STUDENT OPERATIONS ====================

// Get Public Events
export const getPublicEvents = async (req: Request, res: Response): Promise<any> => {
    try {
        const events = await EventModel.find({ status: "active" }).sort({ date: 1 });
        return res.status(200).json({ success: true, events });
    } catch (error: any) {
        console.error("Error fetching public events:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch events" });
    }
};

// Get Single Event details
export const getEventDetails = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const event = await EventModel.findById(id);
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }
        return res.status(200).json({ success: true, event });
    } catch (error: any) {
        console.error("Error fetching event details:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch event details" });
    }
};

// Get My Booked Events
export const getMyBookings = async (req: any, res: Response): Promise<any> => {
    try {
        const studentEmail = req.user?.email;
        if (!studentEmail) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const bookings = await EventBookingModel.find({ studentEmail, status: "booked" })
            .populate("eventId")
            .sort({ bookingDate: -1 });

        return res.status(200).json({ success: true, bookings });
    } catch (error: any) {
        console.error("Error fetching student bookings:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch bookings" });
    }
};

// Book FREE event directly
export const bookEventFree = async (req: any, res: Response): Promise<any> => {
    try {
        const { eventId } = req.body;
        const studentEmail = req.user?.email;

        if (!studentEmail) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const event = await EventModel.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        if (event.status !== "active") {
            return res.status(400).json({ success: false, message: "Event is not active" });
        }

        if (event.price > 0) {
            return res.status(400).json({ success: false, message: "This event is paid. Please use secure checkout." });
        }

        // Check availability
        if (event.seatsBooked >= event.seat) {
            return res.status(400).json({ success: false, message: "No seats available for this event" });
        }

        // Check if already booked
        const existing = await EventBookingModel.findOne({ eventId, studentEmail, status: "booked" });
        if (existing) {
            return res.status(409).json({ success: false, message: "You have already booked a seat for this event" });
        }

        const booking = await EventBookingModel.create({
            eventId,
            studentEmail,
            paymentId: "FREE",
            amount: 0,
            status: "booked"
        });

        // Increment seatsBooked
        event.seatsBooked = (event.seatsBooked || 0) + 1;
        await event.save();

        // Send booking confirmation email
        try {
            const student = await EnrollmentModel.findOne({ email: studentEmail });
            const fullname = student?.fullname || studentEmail;

            await sendEventBookingSuccessEmail(studentEmail, {
                fullname,
                eventTitle: event.title,
                amount: 0,
                paymentId: "FREE",
                date: event.date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
                time: event.time,
                place: event.place
            });
        } catch (mailErr) {
            console.error("Failed to send free event email:", mailErr);
        }

        // Award XP for event booking
        try {
            const student = await EnrollmentModel.findOne({ email: studentEmail });
            if (student) {
                await awardXP(student._id.toString(), "EVENT_BOOKING", `Booked free event: ${event.title}`);
            }
        } catch (xpErr) {
            console.error("Failed to award XP for event:", xpErr);
        }

        return res.status(201).json({ success: true, message: "Seat booked successfully!", booking });
    } catch (error: any) {
        console.error("Error booking free event:", error);
        return res.status(500).json({ success: false, message: "Failed to book event", error: error.message });
    }
};

// Initiate Paid Event Booking
export const initiateEventPayment = async (req: any, res: Response): Promise<any> => {
    try {
        const { eventId } = req.body;
        const studentEmail = req.user?.email;

        if (!studentEmail) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const event = await EventModel.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        if (event.status !== "active") {
            return res.status(400).json({ success: false, message: "Event is not active" });
        }

        if (event.price <= 0) {
            return res.status(400).json({ success: false, message: "This event is free." });
        }

        // Check availability
        if (event.seatsBooked >= event.seat) {
            return res.status(400).json({ success: false, message: "No seats available for this event" });
        }

        // Check if already booked
        const existing = await EventBookingModel.findOne({ eventId, studentEmail, status: "booked" });
        if (existing) {
            return res.status(409).json({ success: false, message: "You have already booked a seat for this event" });
        }

        const razorpay = getRazorpayInstance();

        // Create Razorpay Order
        const razorpayOrder = await razorpay.orders.create({
            amount: event.price * 100, // in paisa
            currency: "INR",
            receipt: `EVT_${Date.now()}`
        });

        // Save Booking in Pending State
        await EventBookingModel.create({
            eventId,
            studentEmail,
            razorpayOrderId: razorpayOrder.id,
            amount: event.price,
            status: "pending"
        });

        return res.status(200).json({
            success: true,
            order: razorpayOrder
        });
    } catch (error: any) {
        console.error("Error initiating event checkout:", error);
        return res.status(500).json({ success: false, message: "Failed to initiate payment" });
    }
};
