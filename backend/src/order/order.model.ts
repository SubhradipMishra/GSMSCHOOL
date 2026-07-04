import { model, Schema } from "mongoose";


const OrderSchema = new Schema({

    studentEmail: {
        type: String,
        required: true,
        trim: true
    },

    courseId: {
        type: String,
        required: true,
        trim: true
    },

    amount: {
        type: Number,
        required: true
    },

    razorpayOrderId: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "pending"
    },



}, { timestamps: true })

const OrderModel = model("Order", OrderSchema);

export default OrderModel;