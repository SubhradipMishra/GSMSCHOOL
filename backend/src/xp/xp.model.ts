import { Schema, model } from "mongoose";

export interface IXPTransaction {
    userId: string;
    action: string;
    xpEarned: number;
    description: string;
    createdAt?: Date;
}

export interface IUserXP {
    userId: string;
    totalXP: number;
    level: number;
    xpToNextLevel: number;
    transactions: IXPTransaction[];
    createdAt?: Date;
    updatedAt?: Date;
}

// XP thresholds per level (level 1 = 0 XP needed, level 2 = 100 XP, etc.)
export const XP_LEVELS = [
    { level: 1, minXP: 0,    title: "Newcomer",    badge: "🌱" },
    { level: 2, minXP: 100,  title: "Initiate",    badge: "⚡" },
    { level: 3, minXP: 250,  title: "Apprentice",  badge: "🔥" },
    { level: 4, minXP: 500,  title: "Practitioner",badge: "⭐" },
    { level: 5, minXP: 900,  title: "Adept",       badge: "🌟" },
    { level: 6, minXP: 1400, title: "Expert",      badge: "🏅" },
    { level: 7, minXP: 2000, title: "Master",      badge: "🏆" },
    { level: 8, minXP: 2800, title: "Grandmaster", badge: "💎" },
    { level: 9, minXP: 3800, title: "Legend",      badge: "🔮" },
    { level: 10,minXP: 5000, title: "Immortal",    badge: "👑" },
];

// XP earned for each action type
export const XP_ACTIONS: Record<string, number> = {
    SIGNUP:           50,
    COURSE_ENROLL:    200,
    EVENT_BOOKING:    100,
    FREE_ENROLL:      75,
    PROFILE_COMPLETE: 50,
    DAILY_LOGIN:      10,
};

const XPTransactionSchema = new Schema<IXPTransaction>({
    userId:      { type: String, required: true },
    action:      { type: String, required: true },
    xpEarned:    { type: Number, required: true },
    description: { type: String, required: true },
}, { timestamps: true });

const UserXPSchema = new Schema<IUserXP>({
    userId:          { type: String, required: true, unique: true },
    totalXP:         { type: Number, default: 0 },
    level:           { type: Number, default: 1 },
    xpToNextLevel:   { type: Number, default: 100 },
    transactions:    [XPTransactionSchema],
}, { timestamps: true });

export const UserXPModel    = model<IUserXP>("UserXP", UserXPSchema);
export const XPLogModel     = model<IXPTransaction>("XPLog", XPTransactionSchema);
