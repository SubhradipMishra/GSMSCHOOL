import { model, Schema } from "mongoose";

export interface ICourse {
    title: string;
    description: string;
    department: string;
    assignedTeacher: string;
    category?: string;
    thumbnail?: string;
    gallery?: string[];
    price?: number;
    tag?: string;
    discount?: number;
    duration?: string;
}

const CourseSchema = new Schema<ICourse>({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true
    },
    assignedTeacher: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: ""
    },
    thumbnail: {
        type: String,
        default: ""
    },
    gallery: {
        type: [String],
        default: []
    },
    price: {
        type: Number,
        default: 0
    },
    tag: {
        type: String,
        default: ""
    },
    discount: {
        type: Number,
        default: 0
    },
    duration: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const CourseModel = model<ICourse>("Course", CourseSchema);

export default CourseModel;
