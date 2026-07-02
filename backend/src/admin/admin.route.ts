import { Router } from "express";
import { createTeacher, getTeachers, updateTeacher, deleteTeacher, createDepartment, getDepartments, updateDepartment, deleteDepartment, createCourse, getCourses, updateCourse, deleteCourse, createCategory, getCategories, updateCategory, deleteCategory, getPublicCourses, getPublicDepartments } from "./admin.controller";
import { adminGaurd } from "../middleware/auth.middleware";
import { upload } from "../middleware/multer.middleware";

const adminRouter = Router();

// Teacher Management Routes
adminRouter.post("/teachers", adminGaurd, createTeacher);
adminRouter.get("/teachers", adminGaurd, getTeachers);
adminRouter.put("/teachers/:id", adminGaurd, updateTeacher);
adminRouter.delete("/teachers/:id", adminGaurd, deleteTeacher);

// Department Management Routes
adminRouter.post("/departments", adminGaurd, upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), createDepartment);
adminRouter.get("/departments", adminGaurd, getDepartments);
adminRouter.put("/departments/:id", adminGaurd, upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), updateDepartment);
adminRouter.delete("/departments/:id", adminGaurd, deleteDepartment);
// Course Management Routes
adminRouter.post("/courses", adminGaurd, upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), createCourse);
adminRouter.get("/courses", adminGaurd, getCourses);
adminRouter.put("/courses/:id", adminGaurd, upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), updateCourse);
adminRouter.delete("/courses/:id", adminGaurd, deleteCourse);

// Category Management Routes
adminRouter.post("/categories", adminGaurd, createCategory);
adminRouter.get("/categories", adminGaurd, getCategories);
adminRouter.put("/categories/:id", adminGaurd, updateCategory);
adminRouter.delete("/categories/:id", adminGaurd, deleteCategory);

// Public routes (no auth)
adminRouter.get("/public/courses", getPublicCourses);
adminRouter.get("/public/departments", getPublicDepartments);
adminRouter.get("/public/categories", getCategories);

export default adminRouter;
