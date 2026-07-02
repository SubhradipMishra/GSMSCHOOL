import { model, Schema } from "mongoose";

export interface IDepartment {
    name: string;
    departmentCode: string;
    description?: string;
    headOfDepartment?: string;
    category?: string;
    thumbnail?: string;
    gallery?: string[];
}

const DepartmentSchema = new Schema<IDepartment>({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    departmentCode: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true
    },
    headOfDepartment: {
        type: String,
        trim: true
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
    }
}, { timestamps: true });

const DepartmentModel = model<IDepartment>("Department", DepartmentSchema);

export default DepartmentModel;
