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

export const authenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session.admin) {
      return res.status(401).json({ message: "Unauthorized. No admin session found." });
    }

    const { adminID } = req.session.admin;
    const admin = await Admin.findById(adminID);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    next();
  } catch (error) {
    console.error("Error during authentication:", error);
    return res.status(401).json({ message: "Unauthorized. Invalid session or token." });
  }
};
