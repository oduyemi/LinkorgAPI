import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/admin.model";

dotenv.config();

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

export const authenticateAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.session.admin) {
            res.status(401).json({ message: "Unauthorized. No admin session found." });
            return;
        }

        const { adminID } = req.session.admin;

        if (!mongoose.Types.ObjectId.isValid(adminID)) {
            res.status(400).json({ message: "Invalid admin ID format." });
            return;
        }

        const admin = await Admin.findById(adminID);
        if (!admin) {
            res.status(404).json({ message: "Admin not found." });
            return;
        }

        next();
    } catch (error) {
        console.error("Error during admin authentication:", error);
        res.status(500).json({ message: "Internal server error during authentication." });
    }
};


