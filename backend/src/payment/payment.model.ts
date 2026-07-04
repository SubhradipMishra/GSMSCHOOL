import { model, Schema } from "mongoose";
const PaymentSchema = new Schema({

    studentEmail: {
        type: String,
        required: true,
        trim: true
    },
    razorpayPaymentId: {
        type: String,
        required: true,
        trim: true
    },
    razorpayOrderId: {
        type: String,
        required: true,
        trim: true
    },
    method: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true })

const PaymentModel = model("Payment", PaymentSchema);

export default PaymentModel;