import { model, Schema, Types } from "mongoose";
import { profile } from "node:console";
import { IEnrollment } from "./enrollment.interface";

const EnrollModel = new Schema<IEnrollment>({
    fullname: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    mobile: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        min: 6
    },
    gender: {
        type: String,
        required: true,
        lowercase: true
    },
    profilePic: {
        type: String

    },
    bio: {
        type: String,
        trim: true,
        lowercase: true,

    },
    adharNo: {
        type: String,
        trim: true,
        required: true


    },
    adharPic: {
        type: String,
        required: true,
    },
    parentName: {
        type: String,
        trim: true,
        required: true,
        lowercase: true
    },
    parentMobileNo: {
        type: String,
        trim: true,
        required: true
    },
    role: {
        type: String,
        enum: ["student", "teacher", "admin"],
        default: "student"
    },
    department: {
        type: String,
        trim: true
    },
    specialty: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    experience: {
        type: String,
        trim: true
    }




}, { timestamps: true })

const EnrollmentModel = model<IEnrollment>("Enrollment", EnrollModel);

export default EnrollmentModel;