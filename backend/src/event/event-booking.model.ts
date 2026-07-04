import mongoose, { Schema, Document } from "mongoose";

export interface IEventBooking extends Document {
    eventId: mongoose.Types.ObjectId;
    studentEmail: string;
    paymentId?: string;
    razorpayOrderId?: string;
    amount: number;
    bookingDate: Date;
    status: "pending" | "booked" | "failed" | "cancelled";
}

const EventBookingSchema: Schema = new Schema({
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    studentEmail: { type: String, required: true },
    paymentId: { type: String },
    razorpayOrderId: { type: String },
    amount: { type: Number, required: true },
    bookingDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["pending", "booked", "failed", "cancelled"], default: "pending" }
}, {
    timestamps: true
});

export default mongoose.model<IEventBooking>("EventBooking", EventBookingSchema);
