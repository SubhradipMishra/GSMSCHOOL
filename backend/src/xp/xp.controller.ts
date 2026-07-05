import { Request, Response } from "express";
import { UserXPModel, XP_LEVELS, XP_ACTIONS } from "./xp.model";

// Helper: compute level from totalXP
export const computeLevel = (totalXP: number) => {
    let currentLevel = XP_LEVELS[0];
    for (const lvl of XP_LEVELS) {
        if (totalXP >= lvl.minXP) currentLevel = lvl;
        else break;
    }
    const nextLevel = XP_LEVELS.find(l => l.level === currentLevel.level + 1);
    const xpForNext = nextLevel ? nextLevel.minXP - totalXP : 0;
    const xpRangeStart = currentLevel.minXP;
    const xpRangeEnd   = nextLevel ? nextLevel.minXP : currentLevel.minXP;
    const progressPct  = nextLevel ? Math.round(((totalXP - xpRangeStart) / (xpRangeEnd - xpRangeStart)) * 100) : 100;

    return {
        level: currentLevel.level,
        title: currentLevel.title,
        badge: currentLevel.badge,
        xpToNextLevel: xpForNext,
        nextLevelTitle: nextLevel?.title || "Max Level",
        progressPct,
    };
};

// Award XP to a user
export const awardXP = async (userId: string, action: string, description?: string): Promise<void> => {
    const xpAmount = XP_ACTIONS[action] ?? 0;
    if (xpAmount === 0) return;

    let record = await UserXPModel.findOne({ userId });
    if (!record) {
        record = await UserXPModel.create({ userId, totalXP: 0, level: 1, xpToNextLevel: 100, transactions: [] });
    }

    record.totalXP += xpAmount;
    const info = computeLevel(record.totalXP);
    record.level         = info.level;
    record.xpToNextLevel = info.xpToNextLevel;

    record.transactions.push({
        userId,
        action,
        xpEarned: xpAmount,
        description: description || action,
    });

    await record.save();
};

// GET /xp/me - get current user's XP profile
export const getMyXP = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = (req as any).user?._id?.toString();
        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

        let record = await UserXPModel.findOne({ userId });
        if (!record) {
            record = await UserXPModel.create({ userId, totalXP: 0, level: 1, xpToNextLevel: 100, transactions: [] });
        }

        const info = computeLevel(record.totalXP);
        const recentTransactions = record.transactions.slice(-10).reverse();

        return res.status(200).json({
            success: true,
            xp: {
                totalXP:         record.totalXP,
                level:           info.level,
                levelTitle:      info.title,
                levelBadge:      info.badge,
                xpToNextLevel:   info.xpToNextLevel,
                nextLevelTitle:  info.nextLevelTitle,
                progressPct:     info.progressPct,
                recentTransactions,
            }
        });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// GET /xp/leaderboard - top 10 students by XP (admin/public)
export const getLeaderboard = async (req: Request, res: Response): Promise<any> => {
    try {
        const EnrollmentModel = (await import("../enrollment/enrollment.model")).default;
        const top = await UserXPModel.find().sort({ totalXP: -1 }).limit(10);

        const leaderboard = await Promise.all(top.map(async (entry, idx) => {
            const user = await EnrollmentModel.findById(entry.userId).select("fullname email role");
            const info = computeLevel(entry.totalXP);
            return {
                rank:        idx + 1,
                userId:      entry.userId,
                fullname:    user?.fullname || "Unknown",
                role:        user?.role || "student",
                totalXP:     entry.totalXP,
                level:       info.level,
                levelTitle:  info.title,
                levelBadge:  info.badge,
            };
        }));

        return res.status(200).json({ success: true, leaderboard });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// GET /xp/all-students - admin view of all student XP
export const getAllStudentsXP = async (req: Request, res: Response): Promise<any> => {
    try {
        const EnrollmentModel = (await import("../enrollment/enrollment.model")).default;
        const students = await EnrollmentModel.find({ role: "student" }).select("fullname email _id");
        
        const result = await Promise.all(students.map(async (student) => {
            const record = await UserXPModel.findOne({ userId: student._id.toString() });
            const totalXP = record?.totalXP ?? 0;
            const info = computeLevel(totalXP);
            return {
                userId:     student._id,
                fullname:   student.fullname,
                email:      student.email,
                totalXP,
                level:      info.level,
                levelTitle: info.title,
                levelBadge: info.badge,
            };
        }));

        result.sort((a, b) => b.totalXP - a.totalXP);

        return res.status(200).json({ success: true, students: result });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// POST /xp/admin/award - admin manually awards XP to a student
export const adminAwardXP = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, xpAmount, reason } = req.body;
        if (!userId || !xpAmount || !reason) {
            return res.status(400).json({ success: false, message: "userId, xpAmount, reason required" });
        }

        let record = await UserXPModel.findOne({ userId });
        if (!record) {
            record = await UserXPModel.create({ userId, totalXP: 0, level: 1, xpToNextLevel: 100, transactions: [] });
        }

        record.totalXP += Number(xpAmount);
        const info = computeLevel(record.totalXP);
        record.level         = info.level;
        record.xpToNextLevel = info.xpToNextLevel;

        record.transactions.push({
            userId,
            action:      "ADMIN_AWARD",
            xpEarned:    Number(xpAmount),
            description: reason,
        });

        await record.save();
        return res.status(200).json({ success: true, message: `Awarded ${xpAmount} XP`, totalXP: record.totalXP });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
