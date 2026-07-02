import { Request, Response } from "express";
import EnrollmentModel from "../enrollment/enrollment.model";
import crypto from "crypto";
import { sendTeacherCredentialsEmail, sendTeacherUpdateEmail, sendTeacherDeletionEmail } from "../utils/mail";
import DepartmentModel from "./department.model";
import CourseModel from "./course.model";
import CategoryModel from "./category.model";

// Create a new teacher
export const createTeacher = async (req: Request, res: Response): Promise<any> => {
    try {
        const { fullname, email, mobile, gender, adharNo, password, department, specialty, address, experience } = req.body;
        
        // Validation
        if (!fullname || !email || !mobile || !gender || !adharNo || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await EnrollmentModel.findOne({ $or: [{ email }, { mobile }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User with this email or mobile already exists" });
        }

        const newTeacher = await EnrollmentModel.create({
            fullname,
            email,
            mobile,
            gender,
            adharNo,
            password, // In a real app, hash this.
            role: "teacher",
            adharPic: "none", // Default or you can add multer for upload
            parentName: "N/A",
            parentMobileNo: "N/A",
            department,
            specialty,
            address,
            experience
        });

        // Send the credentials and details via email
        try {
            await sendTeacherCredentialsEmail(email, {
                fullname,
                email,
                password,
                mobile,
                gender,
                department,
                specialty,
                experience,
                adharNo
            });
        } catch (emailError) {
            console.error("Failed to send teacher credentials email:", emailError);
            // We still return success since the teacher is created, but we could notify frontend
        }

        return res.status(201).json({ success: true, message: "Teacher created successfully and email sent", teacher: newTeacher });
    } catch (error: any) {
        console.error("Error creating teacher:", error);
        return res.status(500).json({ success: false, message: "Failed to create teacher", error: error.message });
    }
};

// Get all teachers
export const getTeachers = async (req: Request, res: Response): Promise<any> => {
    try {
        const teachers = await EnrollmentModel.find({ role: "teacher" }).select("-password");
        return res.status(200).json({ success: true, teachers });
    } catch (error: any) {
        console.error("Error fetching teachers:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch teachers", error: error.message });
    }
};

// Update a teacher
export const updateTeacher = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedTeacher = await EnrollmentModel.findByIdAndUpdate(id, updates, { new: true }).select("-password");
        
        if (!updatedTeacher) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }

        try {
            await sendTeacherUpdateEmail(updatedTeacher.email, updatedTeacher);
        } catch (emailError) {
            console.error("Failed to send teacher update email:", emailError);
        }

        return res.status(200).json({ success: true, message: "Teacher updated successfully", teacher: updatedTeacher });
    } catch (error: any) {
        console.error("Error updating teacher:", error);
        return res.status(500).json({ success: false, message: "Failed to update teacher", error: error.message });
    }
};

// Delete a teacher
export const deleteTeacher = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const deletedTeacher = await EnrollmentModel.findByIdAndDelete(id);

        if (!deletedTeacher) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }

        try {
            await sendTeacherDeletionEmail(deletedTeacher.email, deletedTeacher.fullname);
        } catch (emailError) {
            console.error("Failed to send teacher deletion email:", emailError);
        }

        return res.status(200).json({ success: true, message: "Teacher deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting teacher:", error);
        return res.status(500).json({ success: false, message: "Failed to delete teacher", error: error.message });
    }
};

// ===================== DEPARTMENT CRUD =====================

// Create a new department
export const createDepartment = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, departmentCode, description, headOfDepartment, category } = req.body;
        
        if (!name || !departmentCode) {
            return res.status(400).json({ success: false, message: "Department name and code are required" });
        }

        const existingDept = await DepartmentModel.findOne({ $or: [{ name }, { departmentCode }] });
        if (existingDept) {
            return res.status(400).json({ success: false, message: "Department with this name or code already exists" });
        }

        let thumbnail = "";
        let gallery: string[] = [];

        if (req.files) {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            if (files['thumbnail'] && files['thumbnail'].length > 0) {
                thumbnail = `/uploads/${files['thumbnail'][0].filename}`;
            }
            if (files['gallery'] && files['gallery'].length > 0) {
                gallery = files['gallery'].map(file => `/uploads/${file.filename}`);
            }
        }

        const newDept = await DepartmentModel.create({ name, departmentCode, description, headOfDepartment, category, thumbnail, gallery });
        return res.status(201).json({ success: true, message: "Department created successfully", department: newDept });
    } catch (error: any) {
        console.error("Error creating department:", error);
        return res.status(500).json({ success: false, message: "Failed to create department", error: error.message });
    }
};

// Get all departments
export const getDepartments = async (req: Request, res: Response): Promise<any> => {
    try {
        const departments = await DepartmentModel.find();
        return res.status(200).json({ success: true, departments });
    } catch (error: any) {
        console.error("Error fetching departments:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch departments", error: error.message });
    }
};

// Update a department
export const updateDepartment = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const updates: any = { ...req.body };

        if (req.files) {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            if (files['thumbnail'] && files['thumbnail'].length > 0) {
                updates.thumbnail = `/uploads/${files['thumbnail'][0].filename}`;
            }
            if (files['gallery'] && files['gallery'].length > 0) {
                const newGalleryImages = files['gallery'].map(file => `/uploads/${file.filename}`);
                updates.$push = { gallery: { $each: newGalleryImages } };
            }
        }

        const updatedDept = await DepartmentModel.findByIdAndUpdate(id, updates, { new: true });
        
        if (!updatedDept) {
            return res.status(404).json({ success: false, message: "Department not found" });
        }

        return res.status(200).json({ success: true, message: "Department updated successfully", department: updatedDept });
    } catch (error: any) {
        console.error("Error updating department:", error);
        return res.status(500).json({ success: false, message: "Failed to update department", error: error.message });
    }
};

// Delete a department
export const deleteDepartment = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const deletedDept = await DepartmentModel.findByIdAndDelete(id);

        if (!deletedDept) {
            return res.status(404).json({ success: false, message: "Department not found" });
        }

        return res.status(200).json({ success: true, message: "Department deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting department:", error);
        return res.status(500).json({ success: false, message: "Failed to delete department", error: error.message });
    }
};

// ===================== COURSE CRUD =====================

// Create a new course
export const createCourse = async (req: Request, res: Response): Promise<any> => {
    try {
        const { title, description, department, assignedTeacher, category } = req.body;
        
        if (!title || !department || !assignedTeacher) {
            return res.status(400).json({ success: false, message: "Title, department, and assigned teacher are required" });
        }

        const existingCourse = await CourseModel.findOne({ title });
        if (existingCourse) {
            return res.status(400).json({ success: false, message: "Course with this title already exists" });
        }

        let thumbnail = "";
        let gallery: string[] = [];

        if (req.files) {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            if (files['thumbnail'] && files['thumbnail'].length > 0) {
                thumbnail = `/uploads/${files['thumbnail'][0].filename}`;
            }
            if (files['gallery'] && files['gallery'].length > 0) {
                gallery = files['gallery'].map(file => `/uploads/${file.filename}`);
            }
        }

        const newCourse = await CourseModel.create({ title, description, department, assignedTeacher, category, thumbnail, gallery });
        return res.status(201).json({ success: true, message: "Course created successfully", course: newCourse });
    } catch (error: any) {
        console.error("Error creating course:", error);
        return res.status(500).json({ success: false, message: "Failed to create course", error: error.message });
    }
};

// Get all courses
export const getCourses = async (req: Request, res: Response): Promise<any> => {
    try {
        const courses = await CourseModel.find();
        return res.status(200).json({ success: true, courses });
    } catch (error: any) {
        console.error("Error fetching courses:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch courses", error: error.message });
    }
};

// Update a course
export const updateCourse = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const updates: any = { ...req.body };

        if (req.files) {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            if (files['thumbnail'] && files['thumbnail'].length > 0) {
                updates.thumbnail = `/uploads/${files['thumbnail'][0].filename}`;
            }
            if (files['gallery'] && files['gallery'].length > 0) {
                const newGalleryImages = files['gallery'].map(file => `/uploads/${file.filename}`);
                updates.$push = { gallery: { $each: newGalleryImages } };
            }
        }

        const updatedCourse = await CourseModel.findByIdAndUpdate(id, updates, { new: true });
        
        if (!updatedCourse) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        return res.status(200).json({ success: true, message: "Course updated successfully", course: updatedCourse });
    } catch (error: any) {
        console.error("Error updating course:", error);
        return res.status(500).json({ success: false, message: "Failed to update course", error: error.message });
    }
};

// Delete a course
export const deleteCourse = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const deletedCourse = await CourseModel.findByIdAndDelete(id);

        if (!deletedCourse) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        return res.status(200).json({ success: true, message: "Course deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting course:", error);
        return res.status(500).json({ success: false, message: "Failed to delete course", error: error.message });
    }
};

// ===================== CATEGORY CRUD =====================

// Create a new category
export const createCategory = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, description, color } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: "Category name is required" });
        }
        const existing = await CategoryModel.findOne({ name });
        if (existing) {
            return res.status(400).json({ success: false, message: "Category already exists" });
        }
        const newCat = await CategoryModel.create({ name, description, color });
        return res.status(201).json({ success: true, message: "Category created successfully", category: newCat });
    } catch (error: any) {
        console.error("Error creating category:", error);
        return res.status(500).json({ success: false, message: "Failed to create category", error: error.message });
    }
};

// Get all categories
export const getCategories = async (req: Request, res: Response): Promise<any> => {
    try {
        const categories = await CategoryModel.find();
        return res.status(200).json({ success: true, categories });
    } catch (error: any) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch categories", error: error.message });
    }
};

// Update a category
export const updateCategory = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const updated = await CategoryModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        return res.status(200).json({ success: true, message: "Category updated successfully", category: updated });
    } catch (error: any) {
        console.error("Error updating category:", error);
        return res.status(500).json({ success: false, message: "Failed to update category", error: error.message });
    }
};

// Delete a category
export const deleteCategory = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const deleted = await CategoryModel.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        return res.status(200).json({ success: true, message: "Category deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting category:", error);
        return res.status(500).json({ success: false, message: "Failed to delete category", error: error.message });
    }
};

// ===================== PUBLIC ENDPOINTS =====================

export const getPublicCourses = async (req: Request, res: Response): Promise<any> => {
    try {
        const { category } = req.query;
        const filter: any = {};
        if (category && category !== 'all') filter.category = category;
        const courses = await CourseModel.find(filter).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, courses });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Failed to fetch courses" });
    }
};

export const getPublicDepartments = async (req: Request, res: Response): Promise<any> => {
    try {
        const { category } = req.query;
        const filter: any = {};
        if (category && category !== 'all') filter.category = category;
        const departments = await DepartmentModel.find(filter).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, departments });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Failed to fetch departments" });
    }
};
