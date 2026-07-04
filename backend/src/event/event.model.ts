import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
    title: string;
    place: string;
    description: string;
    subject: string;
    organiser: string;
    seat: number;
    seatsBooked: number;
    price: number;
    date: Date;
    time: string;
    dressCode?: string;
    notes?: string;
    documentUrl?: string;
    status: "active" | "cancelled" | "completed";
    createdAt: Date;
}

const EventSchema: Schema = new Schema({
    title: { type: String, required: true },
    place: { type: String, required: true },
    description: { type: String, required: true },
    subject: { type: String, required: true },
    organiser: { type: String, required: true },
    seat: { type: Number, required: true },
    seatsBooked: { type: Number, default: 0 },
    price: { type: Number, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    dressCode: { type: String },
    notes: { type: String },
    documentUrl: { type: String },
    status: { type: String, enum: ["active", "cancelled", "completed"], default: "active" }
}, {
    timestamps: true
});

export default mongoose.model<IEvent>("Event", EventSchema);
