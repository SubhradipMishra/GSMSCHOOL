import { Router } from "express";
import {
    createEvent,
    getAdminEvents,
    updateEvent,
    deleteEvent,
    getPublicEvents,
    getEventDetails,
    getMyBookings,
    bookEventFree,
    initiateEventPayment
} from "./event.controller";
import { adminGaurd, studentGaurd } from "../middleware/auth.middleware";
import { uploadWithDocs } from "../middleware/multer.middleware";

const EventRouter = Router();

// Admin Routes
EventRouter.post("/admin/events", adminGaurd, uploadWithDocs.single("document"), createEvent);
EventRouter.get("/admin/events", adminGaurd, getAdminEvents);
EventRouter.put("/admin/events/:id", adminGaurd, uploadWithDocs.single("document"), updateEvent);
EventRouter.delete("/admin/events/:id", adminGaurd, deleteEvent);

// Student/Public Routes
EventRouter.get("/public/events", getPublicEvents);
EventRouter.get("/public/events/:id", getEventDetails);
EventRouter.get("/student/bookings", studentGaurd, getMyBookings);
EventRouter.post("/student/bookings/free", studentGaurd, bookEventFree);
EventRouter.post("/student/bookings/checkout", studentGaurd, initiateEventPayment);

export default EventRouter;
