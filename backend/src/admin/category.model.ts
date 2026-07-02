import { model, Schema } from "mongoose";

export interface ICategory {
    name: string;
    description?: string;
    color?: string;
}

const CategorySchema = new Schema<ICategory>({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true
    },
    color: {
        type: String,
        default: "#c9a84c"
    }
}, { timestamps: true });

const CategoryModel = model<ICategory>("Category", CategorySchema);

export default CategoryModel;
