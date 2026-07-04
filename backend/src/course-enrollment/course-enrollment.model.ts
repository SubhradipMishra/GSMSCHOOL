import { Schema, model } from "mongoose";


const CourseEnrollmentSchema = new Schema({
    studentEmail: {
        type: String,
        required: true,
        trim: true
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    paymentId: {
        type: String,
        default: "FREE",
        trim: true
    },
    status: {
        type: String,
        enum: ["enrolled", "ongoing", "completed", "expired"],
        default: "enrolled"
    },
    endingDate: {
        type: Date
    },
    duration: {
        type: String
    },
    isFree: {
        type: Boolean,
        default: false
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

const CourseEnrollmentModel = model("CourseEnrollment", CourseEnrollmentSchema);

export default CourseEnrollmentModel;