import mongoose from "mongoose";
import dotenv from "dotenv";
import EnrollmentModel from "../enrollment/enrollment.model";

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.DB_URL as string);
        console.log("Database connected for seeding...");

        const adminExists = await EnrollmentModel.findOne({ email: "gsm@gmail.com" });
        if (adminExists) {
            console.log("Admin already exists!");
            process.exit(0);
        }

        const adminData = {
            fullname: "Admin User",
            email: "gsm@gmail.com",
            mobile: "0000000000",
            password: "123456",
            gender: "male",
            role: "admin",
            adharNo: "000000000000",
            adharPic: "none",
            parentName: "N/A",
            parentMobileNo: "0000000000"
        };

        await EnrollmentModel.create(adminData);
        console.log("Admin user seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();
