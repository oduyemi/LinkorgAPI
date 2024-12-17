import { Request, Response } from "express";
import { transporter } from "../utils/transporter";
import validator from "validator";
import dotenv from "dotenv";
import Email, { IEmail } from "../models/email.model";
import Inbox, { InboxDocument } from "../models/inbox.model";

dotenv.config();


export const getAllInboxEntries = async (req: Request, res: Response): Promise<void> => {
    try {
        const inboxEntries: InboxDocument[] = await Inbox.find();
        res.status(200).json(inboxEntries);
    } catch (error) {
        console.error("Error fetching inbox entries:", error);
        res.status(500).json({ message: "Error fetching inbox entries" });
    }
};

export const getInboxEntryById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const inboxEntry: InboxDocument | null = await Inbox.findById(id);
        if (!inboxEntry) {
            res.status(404).json({ message: "Inbox entry not found" });
            return;
        }
        res.status(200).json(inboxEntry);
    } catch (error) {
        console.error("Error fetching inbox entry:", error);
        res.status(500).json({ message: "Error fetching inbox entry" });
    }
};

export const getAllSentEmails = async (req: Request, res: Response): Promise<void> => {
    try {
        const emails: IEmail[] = await Email.find().sort({ sentAt: -1 }); 
        res.status(200).json(emails);
    } catch (error) {
        console.error("Error fetching emails:", error);
        res.status(500).json({ message: "Failed to fetch emails" });
    }
};

export const getSentEmailById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const email: IEmail | null = await Email.findById(id);

        if (!email) {
            res.status(404).json({ message: "Email not found" });
            return;
        }

        res.status(200).json(email);
    } catch (error) {
        console.error("Error fetching email by ID:", error);
        res.status(500).json({ message: "Failed to fetch email" });
    }
};


export const sendEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, subject, name = "LinkOrg Networks LTD", message } = req.body;
        if (![email, subject, name, message].every(field => field)) {
            res.status(400).json({ message: "All fields (email, subject, name, message) are required" });
            return;
        }

        if (!validator.isEmail(email)) {
            res.status(400).json({ message: "Invalid email format" });
            return;
        }

        if (message.trim().length === 0) {
            res.status(400).json({ message: "Message cannot be empty" });
            return;
        }

        if (!process.env.SMTP_USERNAME || !process.env.SMTP_PWD) {
            res.status(500).json({ message: "SMTP credentials are not set correctly" });
            return;
        }

        const mailOptions = {
            from: `"LinkOrg Admin" <${process.env.SMTP_USERNAME}>`,
            to: email,
            subject,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2 style="color: #2c3e50;">Hello ${name},</h2>
                    <p>${message}</p>
                    <p>Best regards,<br>LinkOrg Team</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        const newEmail = new Email({
            email,
            subject,
            name,
            message,
            sentAt: new Date(),
        });

        await newEmail.save();
        res.status(200).json({ message: "Email sent and saved successfully!" });

    } catch (error: any) {
        console.error("Error sending email:", error.stack || error);
        res.status(500).json({ message: "Failed to send email. Please try again later." });
    }
};
