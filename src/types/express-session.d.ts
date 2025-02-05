import mongoose from "mongoose";

interface AdminSession {
    adminID: mongoose.Types.ObjectId;
    fname: string;
    lname: string;
    email: string;
    phone: string;
    createdAt: Date;
    updatedAt?: Date;
}

declare module "express-session" {
    interface SessionData {
        admin?: AdminSession;
    }
}

export {};
