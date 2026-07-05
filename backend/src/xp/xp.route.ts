import { Router } from "express";
import { getMyXP, getLeaderboard, getAllStudentsXP, adminAwardXP } from "./xp.controller";
import { studentGaurd, adminGaurd, adminStudentTeacherGaurd } from "../middleware/auth.middleware";

const XPRouter = Router();

// Student: get own XP profile
XPRouter.get("/me", studentGaurd, getMyXP);

// Public: leaderboard
XPRouter.get("/leaderboard", getLeaderboard);

// Admin: view all students XP
XPRouter.get("/admin/all-students", adminGaurd, getAllStudentsXP);

// Admin: manually award XP to a student
XPRouter.post("/admin/award", adminGaurd, adminAwardXP);

export default XPRouter;
